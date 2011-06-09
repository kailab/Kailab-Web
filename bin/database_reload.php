#!/bin/bash
php app/console --force doctrine:database:drop
php app/console doctrine:database:create
php app/console doctrine:schema:create
