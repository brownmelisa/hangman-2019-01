#!/bin/bash

export MIX_ENV=prod
export PORT=4792
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"

mkdir -p ~/.config
mkdir -p priv/static

mix deps.get --only prod
mix compile

(cd assets && npm install)
(cd assets && webpack --mode production)

mix phx.digest

mix release


