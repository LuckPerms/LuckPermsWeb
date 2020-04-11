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
BYTEBIN_IP="127.8.2.7"
BYTEBIN_PORT="8123"

# User input variables (and their default values)
EXTERNAL_ADDRESS="$(hostname -f)"

################################################################################
# Functions
################################################################################

#
# Utils
#
ask_for_value() {
    local variable_name="$2"        
    local default_value="${!variable_name}"
    local question="$1 [$default_value]: "
    local answer

    read -p "$question" answer
    echo

    declare -g "$variable_name=${answer:-$default_value}"
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

    if [ -z "$ip" ]; then
        echo "/<IPv$ip_version>/d"
    else
        echo "s/<IPv$ip_version>/$ip/g"
    fi
}

#
# Tasks
#
ask_questions() {
    echo "This installer will install LuckPermsWeb and all dependencies and prerequisites for you fully automatically."
    echo "However we need to know a few things first"
    echo

    ask_for_value "Host's public address" EXTERNAL_ADDRESS
}

prepare_installation_location() {
    if [ ! -d "$BASE_DIR" ]; then
        sudo mkdir "$BASE_DIR" 
        sudo chown "$USER:$GROUP" "$BASE_DIR"
    fi

    cd "$BASE_DIR"
}

install_bytebin() {
    mkdir -p bytebin
    pushd bytebin > /dev/null

    # Find free port
    while ! nc -z "$BYTEBIN_IP" "$BYTEBIN_PORT"; do
        BYTEBIN_PORT=$((BYTEBIN_PORT + 1))
    done

    # Download and Copy the Files
    curl -sSLO https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar
    jq \
        --arg ip "$BYTEBIN_IP" \
        --arg port "$BYTEBIN_PORT" \
        '.host = $ip' \
        '.port = $port' \
        "$INSTALLER_DIR/files/bytebin/config.json" > config.json
    sudo sed \
        -e "s@<PATH>@$BASE_DIR/bytebin@g" \
        -e "s/<USER>/$USER/g" \
        -e "s/<GROUP>/$GROUP/g" \
        "$INSTALLER_DIR/files/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service

    # Enable and (Re)Start the Service
    sudo systemctl daemon-reload
    sudo systemctl enable bytebin.service
    sudo systemctl restart bytebin.service

    popd > /dev/null
}

install_webfiles() {
    pushd "$REPO_DIR" > /dev/null

    # Configure web application
    jq --arg url "http://$EXTERNAL_ADDRESS/bytebin/" '.bytebin_url = $url' config.json > config.json.tmp
    mv -f config.json.tmp config.json

    # Render webfiles
    npm install
    npm run build

    popd > /dev/null

    rm -rf webfiles
    mv "$REPO_DIR/dist/" webfiles
}

configure_nginx() {
    pushd /etc/nginx > /dev/null

    # Create config file
    sudo sed \
        -e "$(get_nginx_sed_directive 4 80)" \
        -e "$(get_nginx_sed_directive 6 80)" \
        -e "s/<HOST_ADDRESS>/$EXTERNAL_ADDRESS/g" \
        -e "s@<PATH>@$BASE_DIR/webfiles@g" \
        -e "s/<BYTEBIN_HOST>/$BYTEBIN_IP:$BYTEBIN_PORT/g" \
        "$INSTALLER_DIR/files/nginx/luckpermsweb.conf" > sites-available/luckpermsweb.conf
    sudo ln -fs ../sites-available/luckpermsweb.conf sites-enabled/

    # Reload nginx
    sudo nginx -t && sudo nginx -s reload

    popd > /dev/null

    # Ensure correct file ownership
    sudo chgrp -R www-data webfiles
}

################################################################################
# Actual Code
################################################################################

ask_questions
prepare_installation_location
install_bytebin
install_webfiles
configure_nginx
