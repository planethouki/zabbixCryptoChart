#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir

curl -Ss https://api.zaif.jp/api/1/currency_pairs/all > data/zaif_currencypairs.txt
curl -sS https://bittrex.com/api/v1.1/public/getmarketsummaries > data/bittrex_getmarketsummaries.txt
curl -sS https://poloniex.com/public?command=returnTicker > data/poloniex_returnTicker.txt
curl -sS https://api.bitflyer.jp/v1/markets > data/bitflyer_markets.txt



echo 'end'
