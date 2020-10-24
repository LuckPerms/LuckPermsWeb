#! /bin/bash

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
    sudo rm -rf /etc/nginx/sites-{available,enabled}/luckpermsweb_*.conf || exit $?

    # Reload nginx
    [ -x /usr/sbin/nginx ] && (sudo nginx -t && sudo nginx -s reload || exit $?)

    echo
}

deconfigure_apache() {
    echo "Cleaning up apache..."
    echo

    # Delete config files
    sudo rm -rf /etc/apache2/sites-{available,enabled}/luckpermsweb_*.conf || exit $?

    # Reload apache
    [ -x /usr/sbin/apache2 ] && (sudo apache2ctl configtest && sudo apache2ctl graceful || exit $?)

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

    sudo rm -rf "$BASE_DIR" || exit $?
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
deconfigure_apache
uninstall_bytebin
remove_files
print_end_message
