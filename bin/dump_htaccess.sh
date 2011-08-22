#!/bin/sh

cat > web/.htaccess << "EOF"
RewriteEngine On
EOF

./app/console router:dump-apache --env=prod --base-uri=/kailab >> web/.htaccess
