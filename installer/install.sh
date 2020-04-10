#! /bin/bash

# Get base dir
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

install_bytebin() {
    mkdir bytebin
    pushd bytebin
    
    curl -O https://ci.lucko.me/job/bytebin/lastSuccessfulBuild/artifact/target/bytebin.jar
    cp "$BASE_DIR/bytebin/config.json" .
    sudo sed -e "s@<PATH>@$(pwd)@" -e "s/<USER>/$(id -un)/" -e "s/<GROUP>/$(id -gn)/" "$BASE_DIR/bytebin/bytebin.service" > /etc/systemd/system/bytebin.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now bytebin.service
    
    popd
}

install_bytebin
