#! /bin/bash

################################################################################
# Global Variables
################################################################################

UNINSTALL=true

# Get variables from installer
. "$(dirname "${BASH_SOURCE[0]}")/install.sh"

################################################################################
# Functions
################################################################################

#
# Tasks
#
ask_questions() {
    # Uninstall everything
    echo "This uninstaller will remove LuckPermsWeb and all related files"
    echo

    check_sudo
    ask_sudo_pw
}

deconfigure_nginx() {
    echo "Cleaning up nginx..."
    echo

    # Delete config files
    sudo rm -rf /etc/nginx/sites-{available,enabled}/luckpermsweb_*.conf

    # Reload nginx
    sudo nginx -t && sudo nginx -s reload
}

uninstall_bytebin() {
    echo "Uninstalling bytebin..."
    echo

    sudo systemctl disable --now bytebin.service 2> /dev/null
}

remove_files() {
    echo "Removing remaining files..."
    echo

    rm -rf "$BASE_DIR"
}

print_end_message() {
    echo
    echo "All done!"
}

################################################################################
# Actual Code
################################################################################

ask_questions
deconfigure_nginx
uninstall_bytebin
remove_files
print_end_message
