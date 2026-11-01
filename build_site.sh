#!/bin/sh
# Maakt site/index.html voor de eigen site (verdoezeld). Zie build_site.js.
cd "$(dirname "$0")" && node build_site.js
