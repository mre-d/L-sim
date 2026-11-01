#!/bin/sh
# Maakt de versie voor de eigen site (stormtoren.cordain.nl): index.html met doctype + mobiele meta-tags ervoor.
cd "$(dirname "$0")" && mkdir -p site && cat site_head.html index.html > site/index.html && echo "site/index.html klaar"
