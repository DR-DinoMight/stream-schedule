#!/bin/bash

DENO_INSTALL="/home/forge/.deno"
PATH="$DENO_INSTALL/bin:$PATH"

deno run --unstable --allow-net --allow-read --allow-env --allow-write=./public/scripts/,./.twitch_key index.js
