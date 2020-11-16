#!/bin/bash

if [ ! -f '/opt/luckpermsweb/config.json' ]; then
    echo "[INFO] Generating config file"
    # Move file over to correct location
    mv /opt/luckpermsweb/docker.config.json /opt/luckpermsweb/config.json 

    # Verify variables
    if [ -z ${BYTEBIN_URL+x} ]; then
        BYTEBIN_URL="https://bytebin.lucko.me/"
    fi

    if [ -z ${BASE_DIRECTORY+x} ]; then
        BASE_DIRECTORY="/"
    fi

    if [ -z ${METADATA_URL+x} ]; then
        METADATA_URL="https://metadata.luckperms.net"
    fi

    # write config file
    sed -i "s|#bytebin#|$BYTEBIN_URL|g" /opt/luckpermsweb/config.json
    sed -i "s|#baseDir#|$BASE_DIRECTORY|g" /opt/luckpermsweb/config.json
    sed -i "s|#metadata#|$METADATA_URL|g" /opt/luckpermsweb/config.json
fi

if [ ! -f '/opt/luckpermsweb/dist' ]; then
    echo "[INFO] Building LuckPermsWeb"
    cd /opt/luckpermsweb
    /usr/bin/npm run build
fi

echo "[INFO] Starting webserver"
nginx -g 'pid /tmp/nginx.pid; daemon off;'