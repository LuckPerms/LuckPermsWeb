#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get base dirs
INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_DIR="$(cd "$INSTALLER_DIR/.." >/dev/null 2>&1 && pwd)"
BASE_DIR="/opt/luckpermsweb"
# User info
USER="$(id -un)"
GROUP="$(id -gn)"
# Misc
declare -a PACKAGES_TO_INSTALL
export NODE_VERSION=12
BYTEBIN_IP="127.8.2.7"
BYTEBIN_PORT="8123"

# User input variables (and their default values)
EXTERNAL_ADDRESS="$(hostname -f)"
USE_HTTPS=true

################################################################################
# Functions
################################################################################

#
# Utils
#
check_sudo() {
    # We are root, no need to check.
    [ "$EUID" -eq 0 ] && return 0

    echo "First we need to make sure that you have sudo permissions"
    echo -n "Can use sudo: "

    local prompt
    prompt=$(sudo -nv 2>&1)
    if [ $? -eq 0 ]; then
        : # Has sudo permissions and password entered recently
    elif echo $prompt | grep -q '^sudo:'; then
        : # Has sudo permissions but needs password
    else
        # No sudo permissions whatsoever
        echo "No"
        echo
        echo "Exiting installer. Run again with a user that has sudo permissions"

        exit 1
    fi

    echo "Yes"
    echo
}

ask_sudo_pw() {
    # Skipping because we are root
    [ "$EUID" -eq 0 ] && return 0

    echo "Everything ready."
    echo "Please enter your sudo password to proceed..."
    sudo -v
}

ask_for_value() {
    local variable_name="$2"
    local default_value="${!variable_name}"
    local question="$1 [$default_value]: "
    local answer

    read -p "$question" answer
    echo

    declare -g "$variable_name=${answer:-$default_value}"
}

ask_yes_no() {
    local variable_name="$2"
    local choice_indicator="$(([ -n "${!variable_name}" ] && "${!variable_name}") && echo "Y/n" || echo "y/N")"
    local question="$1 [$choice_indicator]: "
    local answer

    read -p "$question" answer
    while [ -n "$answer" ] && [ "$answer" != "Y" ] && [ "$answer" != "y" ] && [ "$answer" != "N" ] && [ "$answer" != "n" ]; do
        read -p "Please answer with \"y\" or \"n\" [$choice_indicator]: " answer
    done

    if [ "$answer" == "Y" ] || [ "$answer" == "y" ]; then
         declare -g "$variable_name=true"
    elif [ "$answer" == "N" ] || [ "$answer" == "n" ] || [ -z "${!variable_name}" ]; then
         declare -g "$variable_name=false"
    fi
}

command_exists() {
    local program="$1"

    which "$program" > /dev/null
}

check_package() {
    local program="$1"
    local package="$2"
    
    if ! command_exists "$program"; then
        PACKAGES_TO_INSTALL+=("$package")
    fi
}

check_nodejs() {
    echo
    echo "Checking for node.js..."
    echo -n "> "

    local nvm_needed=true

    if command_exists nodejs && command_exists npm; then
        local node_version="$(nodejs --version)"
        local node_major_version="${node_version%%.*}"
        node_major_version="${node_major_version#v}"

        echo -n "node.js installed: version $node_version - "

        if [ "$node_major_version" -ne "$NODE_VERSION" ]; then
            echo "unsupported!"
        else
            echo "supported"

            nvm_needed=false
        fi
    else
       echo "node.js not installed on the system"
    fi
    
    if "$nvm_needed"; then
        echo
        echo "No supported node.js version found. Using NVM to install a temporary version..."
        echo

        export NVM_DIR="$INSTALLER_DIR/.nvm"
        mkdir -p "$NVM_DIR"
        
        # Install NVM in local dir
        # https://github.com/nvm-sh/nvm
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | PROFILE=/dev/null bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm use node
    fi
}

find_free_port() {
    local ip="$1"
    local port="$2"

    while nc -z "$ip" "$port"; do
        port=$((port + 1))
    done

    echo "$port"
}

get_nginx_ip() {
    [ $# -ne 2 ] && return 1

    local ip_version="$1"
    local port="$2"

    # Try detecting the IP nginx listens to (and filter out localhosts)
    local socket="$(
        netstat -tplnW -"$ip_version" |
        grep nginx |
        grep "$port" |
        tr -s ' ' |
        cut -d' ' -f4 |
        grep -v " 127." |
        grep -v " ::1:" |
        head -n1
    )"

    echo "${socket%:*}"
}

get_nginx_sed_directive() {
    [ $# -ne 2 ] && return 1

    local ip_version="$1"
    local port="$2"

    local ip="$(get_nginx_ip "$ip_version" "$port")"
    
    if [ -z "$ip" ] && [ "$port" == 443 ]; then
        # If we can't find a HTTPS port, we look for a HTTP port
        ip="$(get_nginx_ip "$ip_version" 80)"
    fi

    if [ -z "$ip" ]; then
        echo "/<IPv$ip_version>/d"
    else
        echo "s/<IPv$ip_version>/$ip/g"
    fi
}

create_nginx_file() {
    sed \
        -e "$(get_nginx_sed_directive 4 "$HTTP_PORT")" \
        -e "$(get_nginx_sed_directive 6 "$HTTP_PORT")" \
        -e "s/<HOST_ADDRESS>/$EXTERNAL_ADDRESS/g" \
        -e "s/<CERT_PATH>/$HTTPS_CERT_PATH/g" \
        -e "s/<KEY_PATH>/$HTTPS_KEY_PATH/g" \
        -e "s@<PATH>@$BASE_DIR/webfiles@g" \
        -e "s/<BYTEBIN_HOST>/$BYTEBIN_IP:$BYTEBIN_PORT/g" \
        "$@"
}

# Stop execution if we are uninstalling because all we want are variables and utils
[ -n "$UNINSTALL" ] && return 0

#
# Tasks
#
ask_questions() {
    echo "This installer will install LuckPermsWeb and all dependencies and prerequisites for you fully automatically."
    echo "However we need to know a few things first"
    echo

    check_sudo

    ask_for_value "Host's public address" EXTERNAL_ADDRESS
    ask_yes_no "Use HTTPS" USE_HTTPS

    ask_sudo_pw

    # Configure global variables based on the input values
    PROTOCOL="$("$USE_HTTPS" && echo "https" || echo "http")"
    HTTP_PORT="$("$USE_HTTPS" && echo "443" || echo "80")"
    EDITOR_URL="$PROTOCOL://$EXTERNAL_ADDRESS/"
    BYTEBIN_URL="${EDITOR_URL}bytebin/"
    
    if "$USE_HTTPS"; then
        HTTPS_CERT_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/fullchain.pem"
        HTTPS_KEY_PATH="/etc/letsencrypt/live/$EXTERNAL_ADDRESS/fullchain.pem"
    fi
}

install_prerequisites() {
    echo "Checking if all prerequisites are installed..."

    local -A packages=([java]=default-jre-headless [jq]=jq [nc]=netcat [netstat]=net-tools [sed]=sed [wget]=wget)

    # Conditional packages
    "$USE_HTTPS" && packages+=([certbot]=letsencrypt)

    #
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
        "$INSTALLER_DIR/files/bytebin/bytebin.service" | sudo dd of=/etc/systemd/system/bytebin.service

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
    jq --arg url "$BYTEBIN_URL" '.bytebin_url = $url' config.json > config.json.tmp
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
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer_certbot.conf" | sudo dd of="$nginx_config_file"

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
        "$INSTALLER_DIR/files/nginx/luckpermsweb_footer.conf" | sudo dd of="$nginx_config_file"
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
    echo "# Using a selfhosted web editor instance"
    echo "web-editor-url: '$EDITOR_URL'"
    echo "bytebin-url: '$BYTEBIN_URL'"
}

################################################################################
# Actual Code
################################################################################

ask_questions
install_prerequisites
prepare_installation_location
install_bytebin
install_webfiles
"$USE_HTTPS" && generate_https_cert
configure_nginx
print_config_instructions
