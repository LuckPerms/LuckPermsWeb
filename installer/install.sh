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

################################################################################
# Functions
################################################################################

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

    curl -sSLO https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar
    sed -e "s/<IP>/$BYTEBIN_IP/g" "$INSTALLER_DIR/files/bytebin/config.json" > config.json
    sudo sed -e "s@<PATH>@$BASE_DIR/bytebin@g" -e "s/<USER>/$USER/g" -e "s/<GROUP>/$GROUP/g" "$INSTALLER_DIR/files/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service
    sudo systemctl daemon-reload
    sudo systemctl enable bytebin.service
    sudo systemctl restart bytebin.service

    popd > /dev/null
}

install_webfiles() {
    # Render webfiles
    pushd "$REPO_DIR" > /dev/null
    npm install
    npm run build
    popd > /dev/null

    rm -rf webfiles
    mv "$REPO_DIR/dist/" webfiles
}

configure_nginx() {
    pushd /etc/nginx > /dev/null

    # Create config file
    sudo sed -e "s@<PATH>@$BASE_DIR/webfiles@g" -e "s/<IP>/$BYTEBIN_IP/g" "$INSTALLER_DIR/files/nginx/luckpermsweb.conf" > sites-available/luckpermsweb.conf
    sudo ln -s ../sites-available/luckpermsweb.conf sites-enabled/

    # Reload nginx
    sudo nginx -t && sudo nginx -s reload

    popd > /dev/null
}

################################################################################
# Actual Code
################################################################################

prepare_installation_location
install_bytebin
install_webfiles
configure_nginx
