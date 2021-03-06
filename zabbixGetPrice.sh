#!/bin/bash

if [ `echo $1 | grep 'null'` ] ; then
  echo null;
  exit
fi

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir

case "$1" in
"coincheck" )
  curl -sS https://coincheck.com/api/rate/$2 | jq '.rate | tonumber'
;;
"bitbank" )
  curl -sS -X GET --header 'Accept: application/json' "https://public.bitbank.cc/$2/ticker" | jq '.data.last | tonumber'
;;
"poloniex" )
  #curl -sS https://poloniex.com/public?command=returnTicker | jq --arg res $2 '.[$res].last | tonumber'
  cat data/poloniex_returnTicker.txt | jq --arg res $2 '.[$res].last | tonumber'
;;
"zaif" )
  curl -Ss https://api.zaif.jp/api/1/ticker/$2 | jq .last
;;
"bittrex" )
  #curl -sS https://bittrex.com/api/v1.1/public/getticker?market=$2 | jq '.result.Last'
  cat data/bittrex_getmarketsummaries.txt | jq --arg res $2 '.result | map(select(.MarketName==$res)) | .[].Last | tonumber'
;;
"bitflyer" )
  curl -Ss https://api.bitflyer.jp/v1/ticker?product_code=$2 | jq '.ltp | tonumber'
;;
"cryptopia" )
  cat data/cryptopia_getmarkets.txt | jq --arg res $2 '.Data | map(select(.Label==$res)) | .[].LastPrice'
;;
"fisco" )
  curl -Ss https://api.fcce.jp/api/1/last_price/$2 | jq '.last_price'
;;
esac
