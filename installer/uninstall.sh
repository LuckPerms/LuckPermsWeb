#! /bin/bash

################################################################################
# Global Variables
################################################################################

# Get variables and helper functions from common script
. "$(dirname "${BASH_SOURCE[0]}")/common.sh"

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

    echo
}

uninstall_bytebin() {
    echo "Uninstalling bytebin..."
    echo

    sudo systemctl disable --now bytebin.service

    echo
}

remove_files() {
    echo "Removing remaining files..."
    echo

    sudo rm -rf "$BASE_DIR"
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
