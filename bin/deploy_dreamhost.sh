#!/bin/bash
rsync  -azC --force --delete --progress --exclude-from=bin/rsync_exclude.txt -e "ssh -p22" ./ miguel_ibero@peix.org:~/kailab.peix.org/
