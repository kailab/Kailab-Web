#!/bin/sh
echo 'RewriteEngine On' > web/.htaccess
./app/console router:dump-apache --env=prod --base-uri=/kailab >> web/.htaccess
