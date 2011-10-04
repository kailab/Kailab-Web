#!/bin/bash
php app/console --force doctrine:database:drop
php app/console doctrine:database:create
php app/console doctrine:schema:create
php app/console fos:user:create admin admin@kailab.com admin01
php app/console fos:user:promote admin
