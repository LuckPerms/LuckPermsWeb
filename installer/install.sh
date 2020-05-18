#! /bin/bash           

################################################################################
# Global Variables
################################################################################

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

    ask_yes_no "Expert Mode" EXPERT_MODE

    ask_for_value "Host's public address" EXTERNAL_ADDRESS
    ask_yes_no "Use HTTPS" USE_HTTPS

    LISTEN_IPV4="$(get_nginx_ip 4)"
    LISTEN_IPV6="$(get_nginx_ip 6)"

    if "$EXPERT_MODE"; then
        if "$USE_HTTPS"; then
            ask_yes_no "Automatically generate HTTPS certificates using Let's Encrypt" USE_LETSENCRYPT

            if ! "$USE_LETSENCRYPT"; then
                ask_for_value "Path to the certificate" HTTPS_CERT_PATH
                ask_for_value "Path to the certificate key" HTTPS_CERT_KEY
            fi
        fi

        if [ ! -x /usr/sbin/nginx ]; then
            ask_yes_no "You don't have nginx installed. Install it" INSTALL_NGINX
        fi

        while
            ask_for_value "nginx IPv4 listen address (\"none\" to disable)" LISTEN_IPV4
            ask_for_value "nginx IPv6 listen address (\"none\" to disable)" LISTEN_IPV6
            [ "$LISTEN_IPV4" == none ] && [ "$LISTEN_IPV6" == none ]
        do
            echo "You need to listen to at least one IP address!"

            # Reset them
            LISTEN_IPV4="$(get_nginx_ip 4)"
            LISTEN_IPV6="$(get_nginx_ip 6)"
        done

        ask_yes_no "Setup tools only (web editor, verbose & tree viewers)" SELFHOSTED
    fi

    ask_sudo_pw

    echo
}

setup_submodules() {
    echo "Downloading and updating submodules..."
    echo

    git -C "$INSTALLER_DIR" submodule update --init --recursive

    echo
}

install_prerequisites() {
    echo "Checking if all prerequisites are installed..."

    local -A packages=([java]=default-jre-headless [jq]=jq [nc]=netcat [netstat]=net-tools [sed]=sed [wget]=wget)

    # Conditional packages
    "$USE_HTTPS" && "$USE_LETSENCRYPT" && packages+=([certbot]=letsencrypt)
    "$INSTALL_NGINX" && packages+=([nginx]=nginx-light)

    # Check that packages exist
    for key in "${!packages[@]}"; do
        check_package "$key" "${packages[$key]}"
    done

    if [ "${#PACKAGES_TO_INSTALL[@]}" -ne 0 ]; then
        echo "The following packages are missing and are now being installed: ${PACKAGES_TO_INSTALL[@]}"
        echo "Installing them now..."
        echo

        sudo apt-get update
        sudo apt-get install -y "${PACKAGES_TO_INSTALL[@]}"
    else
        echo "All packages installed!"
    fi

    check_nodejs

    echo
}

calculate_variables() {
    "$USE_HTTPS" || USE_LETSENCRYPT=false

    PROTOCOL="$("$USE_HTTPS" && echo "https" || echo "http")"
    BASE_URL="$PROTOCOL://$EXTERNAL_ADDRESS/"
    BYTEBIN_URL="${BASE_URL}bytebin/"

    if "$USE_HTTPS" && "$USE_LETSENCRYPT"; then
        HTTPS_CERT_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/fullchain.pem"
        HTTPS_KEY_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/privkey.pem"
    fi

    NGINX_LISTEN_DIRECTIVE_IPV4="$(get_nginx_sed_directive 4)"
    NGINX_LISTEN_DIRECTIVE_IPV6="$(get_nginx_sed_directive 6)"
}

prepare_installation_location() {
    echo "Now installing LuckPermsWeb..."
    echo

    if [ ! -d "$BASE_DIR" ]; then
        sudo mkdir "$BASE_DIR"
        sudo chown "$USER:$GROUP" "$BASE_DIR"
    fi

    cd "$BASE_DIR"
}

install_bytebin() {
    echo "Installing bytebin..."

    mkdir -p bytebin
    pushd bytebin > /dev/null

    # Find free port (stop the service if running)
    sudo systemctl stop bytebin.service 2> /dev/null
    BYTEBIN_PORT="$(find_free_port "$BYTEBIN_IP" "$BYTEBIN_PORT")"

    # Download and Copy the Files
    wget -q --show-progress --progress=dot:mega https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar
    echo
    jq \
        --arg ip "$BYTEBIN_IP" \
        --argjson port "$BYTEBIN_PORT" \
        '.host = $ip | .port = $port' \
        "$INSTALLER_DIR/files/bytebin/config.json" > config.json
    sed \
        -e "s@<PATH>@$BASE_DIR/bytebin@g" \
        -e "s/<USER>/$USER/g" \
        -e "s/<GROUP>/$GROUP/g" \
        "$INSTALLER_DIR/files/bytebin/bytebin.service" | sudo dd of=/etc/systemd/system/bytebin.service 2> /dev/null

    # Enable and (Re)Start the Service
    sudo systemctl daemon-reload
    sudo systemctl enable --now bytebin.service

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
        config.json > config.json.tmp
    mv -f config.json.tmp config.json

    # Render webfiles
    npm install
    npm run build

    popd > /dev/null

    rm -rf webfiles
    mv "$REPO_DIR/dist/" webfiles
}

generate_https_cert() {
    # We don't need to generate the HTTPS certificate if it already exists
    [ -f "$HTTPS_CERT_PATH" ] && [ -f "$HTTPS_KEY_PATH" ] && return 0

    echo "Generating HTTPS certificate"
    echo

    local nginx_config_file="/etc/nginx/sites-enabled/certbot_helper_$RANDOM.conf"
    local certdir="$BASE_DIR/webfiles"

    # Configure nginx for the cerbot
    create_nginx_file \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_header_http.conf" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer_certbot.conf" | sudo dd of="$nginx_config_file" 2> /dev/null

    ## Reload nginx
    sudo nginx -t && sudo nginx -s reload

    # Get certificate
    sudo certbot certonly --webroot --rsa-key-size 4096 -w "$certdir" -d "$EXTERNAL_ADDRESS"

    sudo rm -rf "$nginx_config_file" "$certdir/.well-known"
}

configure_nginx() {
    echo "Setting up nginx..."
    echo

    pushd /etc/nginx > /dev/null

    # Create config file
    local nginx_config_file="sites-available/luckpermsweb_$EXTERNAL_ADDRESS.conf"
    create_nginx_file \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_header_$PROTOCOL.conf" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer.conf" | sudo dd of="$nginx_config_file" 2> /dev/null
    sudo ln -fs "../$nginx_config_file" sites-enabled/

    # Reload nginx
    sudo nginx -t && sudo nginx -s reload

    popd > /dev/null

    # Ensure correct file ownership
    sudo chgrp -R www-data webfiles
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
    echo "tree-viewer-url: '${BASE_URL}tree/'"
    echo
    echo "bytebin-url: '$BYTEBIN_URL'"
}

################################################################################
# Actual Code
################################################################################

ask_questions
setup_submodules
install_prerequisites
calculate_variables
prepare_installation_location
install_bytebin
install_webfiles
"$USE_LETSENCRYPT" && generate_https_cert
configure_nginx
print_config_instructions
