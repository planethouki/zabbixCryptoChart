#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir

curl -sS https://api.bitflyer.jp/v1/markets > data/bitflyer_markets.txt
curl -sS https://api.zaif.jp/api/1/currency_pairs/all > data/zaif_currencypairs.txt
curl -sS https://api.kraken.com/0/public/AssetPairs > data/kraken_assetpairs.txt

OERID=`cat ./openexchangerates.txt`
curl -sS https://openexchangerates.org/api/latest.json?app_id=$OERID > data/openexchangerates_latest.txt

echo 'end'
