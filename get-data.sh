#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir


curl -sS https://bittrex.com/api/v1.1/public/getmarketsummaries > data/bittrex_getmarketsummaries.txt
curl -sS https://poloniex.com/public?command=returnTicker > data/poloniex_returnTicker.txt
curl -sS https://www.cryptopia.co.nz/api/GetMarkets > data/cryptopia_getmarkets.txt



echo 'end'
