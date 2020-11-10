#! /bin/bash

# Get variables and helper functions from common script
. "$(dirname "${BASH_SOURCE[0]}")/common.sh"

################################################################################
# Functions
################################################################################

#
# Tasks
#
ask_questions() {
    echo "This installer will install LuckPermsWeb and all dependencies and prerequisites for you fully automatically."
    echo "However we need to know a few things first"
    echo

    check_sudo

    if [ -x /usr/sbin/nginx ]; then
        USE_NGINX=true
    elif [ -x /usr/sbin/apache2 ]; then
        USE_APACHE=true
    else
        SERVER_TO_INSTALL=

        while
            ask_for_value "Which webserver do you want to install (nginx or apache)" SEVER_TO_INSTALL
            [ "$SEVER_TO_INSTALL" != nginx ] && [ "$SEVER_TO_INSTALL" != apache ]
        do
            echo "You need to specify if you want to use nginx or apache!"

            # Reset
            SERVER_TO_INSTALL=
        done

        [ "$SEVER_TO_INSTALL" == nginx ]  && USE_NGINX=true
        [ "$SEVER_TO_INSTALL" == apache ] && USE_APACHE=true
    fi

    WEBSERVER=
    "$USE_NGINX"  && WEBSERVER=nginx
    "$USE_APACHE" && WEBSERVER=apache

    if "$SETTINGS_LOADED"; then
        update_settings=false
        ask_yes_no "We found previous settings. Do you want to edit them?" update_settings

        ! "$update_settings" && return

        echo "Note:"
        echo "If you want to reset all settings to default run this command:"
        echo "rm ${INSTALLER_SETTINGS@Q}"
        echo
    fi

    ask_yes_no "Expert Mode" EXPERT_MODE

    ask_for_value "Host's public address" EXTERNAL_ADDRESS
    ask_yes_no "Use HTTPS" USE_HTTPS

    [ "$LISTEN_IPV4" == autodetect ] && LISTEN_IPV4="$(get_webserver_ip "$WEBSERVER" 4)"
    [ "$LISTEN_IPV6" == autodetect ] && LISTEN_IPV6="$(get_webserver_ip "$WEBSERVER" 6)"

    if "$EXPERT_MODE"; then
        if "$USE_HTTPS"; then
            ask_yes_no "Automatically generate HTTPS certificates using Let's Encrypt" USE_LETSENCRYPT

            if ! "$USE_LETSENCRYPT"; then
                ask_for_value "Path to the certificate" HTTPS_CERT_PATH
                ask_for_value "Path to the certificate key" HTTPS_CERT_KEY
            fi
        fi

        if   "$USE_NGINX" &&  [ ! -x /usr/sbin/nginx ];   then
            ask_yes_no "You don't have nginx installed. Install it"  INSTALL_NGINX
        elif "$USE_APACHE" && [ ! -x /usr/sbin/a2enmod ]; then
            ask_yes_no "You don't have apache installed. Install it" INSTALL_APACHE
        fi

        ask_yes_no "Install local bytebin" INSTALL_BYTEBIN

        while
            ask_for_value "$WEBSERVER IPv4 listen address (\"none\" to disable)" LISTEN_IPV4
            ask_for_value "$WEBSERVER IPv6 listen address (\"none\" to disable)" LISTEN_IPV6
            [ "$LISTEN_IPV4" == none ] && [ "$LISTEN_IPV6" == none ]
        do
            echo "You need to listen to at least one IP address!"

            # Reset them
            LISTEN_IPV4="$(get_webserver_ip "$WEBSERVER" 4)"
            LISTEN_IPV6="$(get_webserver_ip "$WEBSERVER" 6)"
        done

        ask_yes_no "Setup tools only (web editor, verbose & tree viewers)" SELFHOSTED
    fi
}

setup_submodules() {
    echo
    echo "Downloading and updating submodules..."
    echo

    git -C "$INSTALLER_DIR" submodule update --init --recursive || exit $?

    echo
}

install_prerequisites() {
    echo "Checking if all prerequisites are installed..."

    local -A packages=([jq]=jq [nc]=netcat [netstat]=net-tools [sed]=sed [wget]=wget)

    # Conditional packages
    "$USE_HTTPS"  && "$USE_LETSENCRYPT" && packages+=([certbot]=letsencrypt)
    "$USE_NGINX"  && "$INSTALL_NGINX"   && packages+=([nginx]=nginx-light)
    "$USE_APACHE" && "$INSTALL_APACHE"  && packages+=([apache2]=a2enmod)
    "$INSTALL_BYTEBIN"                  && packages+=([java]=default-jre-headless)

    # Check that packages exist
    for key in "${!packages[@]}"; do
        check_package "$key" "${packages[$key]}"
    done

    if [ "${#PACKAGES_TO_INSTALL[@]}" -ne 0 ]; then
        echo "The following packages are missing and are now being installed: ${PACKAGES_TO_INSTALL[@]}"
        echo "Installing them now..."
        echo

        sudo apt-get update || exit $?
        sudo apt-get install -y "${PACKAGES_TO_INSTALL[@]}" || exit $?
    else
        echo "All packages installed!"
    fi

    check_nodejs

    echo
}

calculate_variables() {
    "$USE_HTTPS" || USE_LETSENCRYPT=false

    PROTOCOL="http$("$USE_HTTPS" && echo "s")"
    BASE_URL="$PROTOCOL://$EXTERNAL_ADDRESS/"
    BYTEBIN_URL="$("$INSTALL_BYTEBIN" && echo "${BASE_URL}bytebin/" || echo "https://bytebin.lucko.me/")"

    if "$USE_HTTPS" && "$USE_LETSENCRYPT"; then
        HTTPS_CERT_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/fullchain.pem"
        HTTPS_KEY_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/privkey.pem"
    fi

    [ "$LISTEN_IPV4" == autodetect ] && LISTEN_IPV4="$(get_webserver_ip "$WEBSERVER" 4)"
    [ "$LISTEN_IPV6" == autodetect ] && LISTEN_IPV6="$(get_webserver_ip "$WEBSERVER" 6)"
    NGINX_LISTEN_DIRECTIVE_IPV4="$(get_ip_sed_directive "$WEBSERVER" 4)"
    NGINX_LISTEN_DIRECTIVE_IPV6="$(get_ip_sed_directive "$WEBSERVER" 6)"
}

prepare_installation_location() {
    echo "Now installing LuckPermsWeb..."
    echo

    if [ ! -d "$BASE_DIR" ]; then
        sudo mkdir "$BASE_DIR" || exit $?
        sudo chown "$USER:$GROUP" "$BASE_DIR" || exit $?
    fi

    cd "$BASE_DIR"
}

install_bytebin() {
    echo "Installing bytebin..."

    mkdir -p bytebin || exit $?
    pushd bytebin > /dev/null

    # Find free port (stop the service if running)
    sudo systemctl stop bytebin.service 2> /dev/null
    BYTEBIN_PORT="$(find_free_port "$BYTEBIN_IP" "$BYTEBIN_PORT")"

    # Download and Copy the Files
    wget -q --show-progress --progress=dot:mega -O bytebin.jar https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar || exit $?
    echo
    jq \
        --arg ip "$BYTEBIN_IP" \
        --argjson port "$BYTEBIN_PORT" \
        '.host = $ip | .port = $port' \
        "$INSTALLER_DIR/files/bytebin/config.json" > config.json || exit $?
    sed \
        -e "s@<PATH>@$BASE_DIR/bytebin@g" \
        -e "s/<USER>/$USER/g" \
        -e "s/<GROUP>/$GROUP/g" \
        "$INSTALLER_DIR/files/bytebin/bytebin.service" | sudo dd of=/etc/systemd/system/bytebin.service 2> /dev/null || exit $?

    # Enable and (Re)Start the Service
    sudo systemctl daemon-reload || exit $?
    sudo systemctl enable --now bytebin.service || exit $?

    popd > /dev/null

    echo
}

install_webfiles() {
    echo "Installing web files..."
    echo

    pushd "$REPO_DIR" > /dev/null

    # Configure web application
    jq \
        --arg url "$BYTEBIN_URL" \
        --argjson selfHosted "$SELFHOSTED" \
        '.bytebin_url = $url | .selfHosted = $selfHosted' \
        config.json > config.json.tmp || exit $?
    mv -f config.json.tmp config.json || exit $?

    # Render webfiles
    npm install || exit $?
    npm run build -- --skip-plugins eslint || exit $?

    popd > /dev/null

    rm -rf webfiles || exit $?
    mv "$REPO_DIR/dist/" webfiles || exit $?
}

generate_https_cert() {
    # We don't need to generate the HTTPS certificate if it already exists
    [ -f "$HTTPS_CERT_PATH" ] && [ -f "$HTTPS_KEY_PATH" ] && return 0

    echo "Generating HTTPS certificate"
    echo

    local nginx_config_file="/etc/nginx/sites-enabled/certbot_helper_$RANDOM.conf"
    local apache_config_file="/etc/apache2/sites-enabled/certbot_helper_$RANDOM.conf"
    local certdir="$BASE_DIR/webfiles"

    # Configure nginx or apache for the certbot
    "$USE_NGINX"  &&
    (create_webserver_file \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_header_http.conf" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer_certbot.conf"    | sudo dd of="$nginx_config_file"  2> /dev/null || exit $?)
    "$USE_APACHE" &&
    (create_webserver_file \
        "$INSTALLER_DIR/files/apache/luckpermsweb_header_http.conf" \
        "$INSTALLER_DIR/files/apache/luckpermsweb_footer_certbot.conf" \
        "$INSTALLER_DIR/files/apache/luckpermsweb_footer_directory.conf" | sudo dd of="$apache_config_file" 2> /dev/null || exit $?)

    ## Reload webserver
    "$USE_NGINX"  && (sudo nginx -t              && sudo nginx -s reload     || exit $?)
    "$USE_APACHE" && (sudo apache2ctl configtest && sudo apache2ctl graceful || exit $?)

    # Get certificate
    sudo certbot certonly --webroot --rsa-key-size 4096 -w "$certdir" -d "$EXTERNAL_ADDRESS" || exit $?

    sudo rm -rf "$nginx_config_file" "$apache_config_file" "$certdir/.well-known" || exit $?
}

configure_nginx() {
    echo "Setting up nginx..."
    echo

    pushd /etc/nginx > /dev/null

    # Create config file
    local nginx_config_file="sites-available/luckpermsweb_$EXTERNAL_ADDRESS.conf"
    create_webserver_file \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_header_$PROTOCOL.conf" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_base.conf" \
        "$("$INSTALL_BYTEBIN" && echo "$INSTALLER_DIR/files/nginx/luckpermsweb_proxy.conf")" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer.conf" | sudo dd of="$nginx_config_file" 2> /dev/null || exit $?
    sudo ln -fs "../$nginx_config_file" sites-enabled/ || exit $?

    # Reload nginx
    sudo nginx -t && sudo nginx -s reload || exit $?

    popd > /dev/null

    # Ensure correct file ownership
    sudo chgrp -R www-data webfiles || exit $?
}

configure_apache() {
    echo "Setting up apache..."
    echo

    pushd /etc/apache2 > /dev/null

    # Install modules
    sudo a2enmod headers proxy proxy_http rewrite ssl || exit $?

    # Create config file
    local apache_config_name="luckpermsweb_$EXTERNAL_ADDRESS"
    local apache_config_file="sites-available/$apache_config_name.conf"
    create_webserver_file \
        "$INSTALLER_DIR/files/apache/luckpermsweb_header_$PROTOCOL.conf" \
        "$INSTALLER_DIR/files/apache/luckpermsweb_base.conf" \
        "$("$INSTALL_BYTEBIN" && echo "$INSTALLER_DIR/files/apache/luckpermsweb_proxy.conf")" \
        "$INSTALLER_DIR/files/apache/luckpermsweb_footer.conf" \
        "$INSTALLER_DIR/files/apache/luckpermsweb_footer_directory.conf" | sudo dd of="$apache_config_file" 2> /dev/null || exit $?
    sudo a2ensite "$apache_config_name" || exit $?

    # Reload apache
    sudo apache2ctl configtest && sudo apache2ctl graceful || exit $?

    popd > /dev/null

    # Ensure correct file ownership
    sudo chgrp -R www-data webfiles || exit $?
}

print_config_instructions() {
    echo
    echo
    echo "Installation done!"
    echo
    echo "Now all that's left to do is add these lines to the end of your LuckPerms config:"
    echo
    echo "# Using a selfhosted LuckPermsWeb instance"
    echo "web-editor-url: '${BASE_URL}editor/'"
    echo "verbose-viewer-url: '${BASE_URL}verbose/'"
    echo "tree-viewer-url: '${BASE_URL}treeview/'"
    echo
    echo "bytebin-url: '$BYTEBIN_URL'"
}

################################################################################
# Actual Code
################################################################################

ask_questions
save_settings # Save so nothing gets lost
ask_sudo_pw
setup_submodules
install_prerequisites
calculate_variables
save_settings # Save again because the variables may have been updated
prepare_installation_location
"$INSTALL_BYTEBIN" && install_bytebin
install_webfiles
"$USE_LETSENCRYPT" && generate_https_cert
"$USE_NGINX"       && configure_nginx
"$USE_APACHE"      && configure_apache
print_config_instructions
