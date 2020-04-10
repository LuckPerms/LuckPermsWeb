#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get base dir
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
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
    cp "$BASE_DIR/bytebin/config.json" .
    sudo sed -e "s@<PATH>@$(pwd)@" -e "s/<USER>/$USER/" -e "s/<GROUP>/$GROUP/" "$BASE_DIR/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now bytebin.service
    
    popd > /dev/null
}

################################################################################
# Actual Code
################################################################################

prepare_installation_location
install_bytebin
