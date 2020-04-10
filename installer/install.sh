#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get base dir
INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
BASE_DIR="$(cd "$INSTALLER_DIR/.." >/dev/null 2>&1 && pwd)"
USER="$(id -un)"
GROUP="$(id -gn)"

################################################################################
# Functions
################################################################################

prepare_installation_location() {
    sudo mkdir /opt/luckperms
    cd /opt/luckperms
    sudo chown "$USER:$GROUP" .
}

install_bytebin() {
    mkdir bytebin
    pushd bytebin > /dev/null

    curl -O https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar
    cp "$INSTALLER_DIR/files/bytebin/config.json" .
    sudo sed -e "s@<PATH>@$(pwd)@g" -e "s/<USER>/$USER/g" -e "s/<GROUP>/$GROUP/g" "$INSTALLER_DIR/files/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now bytebin.service

    popd > /dev/null
}

install_webfiles() {
    mkdir webfiles
    pushd webfiles > /dev/null

    # Render webfiles
    pushd "$BASE_DIR" > /dev/null
    npm install
    npm run build
    popd > /dev/null

    cp -r "$BASE_DIR/dist/" .

    popd > /dev/null
}

################################################################################
# Actual Code
################################################################################

prepare_installation_location
install_bytebin
install_webfiles
