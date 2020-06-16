#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get base dirs
INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_DIR="$(cd "$INSTALLER_DIR/.." >/dev/null 2>&1 && pwd)"
INSTALLER_LOGS_DIR="$INSTALLER_DIR/logs"
BASE_DIR="/opt/luckpermsweb"
# User info
USER="$(id -un)"
GROUP="$(id -gn)"
# Misc
INSTALLER_LOG="$INSTALLER_LOGS_DIR/installer.log"
INSTALLER_SETTINGS="$INSTALLER_DIR/installer.conf"
USE_NGINX=false
USE_APACHE=false
declare -a PACKAGES_TO_INSTALL
export NODE_VERSION=12
BYTEBIN_IP="127.8.2.7"
BYTEBIN_PORT="8123"

# Load settings
if [ -f "$INSTALLER_SETTINGS" ]; then
    . "$INSTALLER_SETTINGS"
    SETTINGS_LOADED=true
else
    SETTINGS_LOADED=false
fi

# User input variables (and their default values)
EXPERT_MODE="${EXPERT_MODE:-false}"
EXTERNAL_ADDRESS="${EXTERNAL_ADDRESS:-"$(hostname -f)"}"
INSTALL_NGINX="${INSTALL_NGINX:-true}"
INSTALL_APACHE="${INSTALL_APACHE:-true}"
USE_HTTPS="${USE_HTTPS:-true}"
LISTEN_IPV4="${LISTEN_IPV4:-autodetect}"
LISTEN_IPV6="${LISTEN_IPV6:-autodetect}"
USE_LETSENCRYPT="${USE_LETSENCRYPT:-true}"
INSTALL_BYTEBIN="${INSTALL_BYTEBIN:-true}"
SELFHOSTED="${SELFHOSTED:-true}"

################################################################################
# Functions
################################################################################

#
# Utils
#
save_settings() {
    (
        echo "${EXPERT_MODE@A}"
        echo "${EXTERNAL_ADDRESS@A}"
        echo "${INSTALL_NGINX@A}"
        echo "${INSTALL_APACHE@A}"
        echo "${USE_HTTPS@A}"
        echo "${LISTEN_IPV4@A}"
        echo "${LISTEN_IPV6@A}"
        echo "${USE_LETSENCRYPT@A}"
        echo "${INSTALL_BYTEBIN@A}"
        echo "${SELFHOSTED@A}"
    ) > "$INSTALLER_SETTINGS"
}

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

sudo_active() {
    sudo -nv 2>&1
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
    echo

    if [ "$answer" == "Y" ] || [ "$answer" == "y" ]; then
         declare -g "$variable_name=true"
    elif [ "$answer" == "N" ] || [ "$answer" == "n" ] || [ -z "${!variable_name}" ]; then
         declare -g "$variable_name=false"
    fi
}

command_exists() {
    local program="$1"

    (which "$program" || sudo -n which "$program") > /dev/null 2>&1
}

get_webserver_ip() {
    if ! command_exists netstat; then
        echo "autodetect"
        return 0
    fi

    local webserver="$1"
    local ip_version="$2"

    if [ $# -eq 2 ]; then
        local ip

        "$USE_HTTPS" && ip="$(get_webserver_ip "$webserver" "$ip_version" 443)"
        [ -z "$ip" ] && ip="$(get_webserver_ip "$webserver" "$ip_version" 80)"
        [ -z "$ip" ] && ip="autodetect"

        echo "$ip"

        return 0
    elif [ $# -ne 3 ]; then
        return 1
    fi

    local port="$2"

    # Try detecting the IP nginx listens to (and filter out localhosts)
    local socket="$(
        exec $(sudo_active && echo sudo) netstat -tplnW -"$ip_version" 2> /dev/null |
        grep "$webserver" |
        grep "$port" |
        tr -s ' ' |
        cut -d' ' -f4 |
        grep -v " 127." |
        grep -v " ::1:" |
        head -n1
    )"

    echo "${socket%:*}"
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
        mkdir -p "$NVM_DIR" || exit $?

        # Install NVM in local dir
        # https://github.com/nvm-sh/nvm
        wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | PROFILE=/dev/null bash || exit $?
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || exit $?
        nvm use node || exit $?
    fi

    echo
}

find_free_port() {
    local ip="$1"
    local port="$2"

    while nc -z "$ip" "$port"; do
        port=$((port + 1))
    done

    echo "$port"
}

get_ip_sed_directive() {
    [ $# -ne 2 ] && return 1

    local webserver="$1"
    local ip_version="$2"
    local ip_variable_name="LISTEN_IPV$ip_version"
    local ip="${!ip_variable_name}"

    [ "$ip" == "autodetect" ] && ip="$(get_webserver_ip "$webserver" "$ip_version")"

    if [ -z "$ip" ] || [ "$ip" == "none" ] || [ "$ip" == "autodetect" ]; then
        "$USE_NGINX"  && echo "/<IPv$ip_version>/d"
        "$USE_APACHE" && echo "s/ <IPv$ip_version>:\(80\|443\)//g"
    else
        echo "s/<IPv$ip_version>/$ip/g"
    fi
}

create_webserver_file() {
    sed \
        -e "$NGINX_LISTEN_DIRECTIVE_IPV4" \
        -e "$NGINX_LISTEN_DIRECTIVE_IPV6" \
        -e "s/<HOST_ADDRESS>/$EXTERNAL_ADDRESS/g" \
        -e "s@<CERT_PATH>@$HTTPS_CERT_PATH@g" \
        -e "s@<KEY_PATH>@$HTTPS_KEY_PATH@g" \
        -e "s@<PATH>@$BASE_DIR/webfiles@g" \
        -e "s/<BYTEBIN_HOST>/$BYTEBIN_IP:$BYTEBIN_PORT/g" \
        "$@"
}

################################################################################
# Self logging
################################################################################

# Running after variable and function initialization because if any of that
# stuff fails we are in much deeper troubles...

# Source https://stackoverflow.com/a/62292109/1996022
if [ "$1" = "--log" ]; then
    # If the first argument is "--log", shift the arg out and continue
    shift
else
    # Make sure the folder exists
    mkdir -p "$INSTALLER_LOGS_DIR"

    # Compress the old log
    if [ -f "$INSTALLER_LOG" ]; then
        old_log="${INSTALLER_LOG/.log/"_$(date "+%Y-%m-%d_%H-%M-%S").log"}"

        mv "$INSTALLER_LOG" "$old_log"
        command_exists gzip && gzip -q9 -- "$old_log"
    fi

    # If run without log, re-run this script within a script command so all
    # script I/O is logged
    script -qec "$0 --log ${*@Q}" "$INSTALLER_LOG"
    exit_code=$?

    # Upload logs on error
    if [ $exit_code -ne 0 ]; then
        echo
        echo "!!! Something went wrong during the script execution !!!"
        echo

        upload_log=true
        ask_yes_no "Do you want your log to be uploaded automatically?" upload_log

        if "$upload_log"; then
            mime="$(file --brief --mime-type -- "$INSTALLER_LOG")"
            key=$(gzip -c9 -- "$INSTALLER_LOG" | \
                curl -sSL -D - -H 'Content-Encoding: gzip' -H "Content-Type: $mime" -X POST --data-binary @- https://bytebin.lucko.me/post -o /dev/null | \
                grep -Fi 'Location: ' | \
                cut -c11-)

            echo "When reaching out to support provide them this link:"
            echo "https://bytebin.lucko.me/$key"
        fi
    fi

    # Keep the exit code
    exit $exit_code
fi
