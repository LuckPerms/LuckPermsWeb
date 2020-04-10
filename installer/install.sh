#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get base dirs
INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_DIR="$(cd "$INSTALLER_DIR/.." >/dev/null 2>&1 && pwd)"
BASE_DIR="/opt/luckperms"
# User info
USER="$(id -un)"
GROUP="$(id -gn)"

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
    cp "$INSTALLER_DIR/files/bytebin/config.json" .
    sudo sed -e "s@<PATH>@$(pwd)@g" -e "s/<USER>/$USER/g" -e "s/<GROUP>/$GROUP/g" "$INSTALLER_DIR/files/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service
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
    cp -r "$REPO_DIR/dist/" webfiles
}

################################################################################
# Actual Code
################################################################################

prepare_installation_location
install_bytebin
install_webfiles
