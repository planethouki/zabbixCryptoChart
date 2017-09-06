#!/bin/bash

if [ `echo $1 | grep 'null'` ] ; then
  echo null;
  exit
fi


case "$1" in
"coincheck" )
  curl -sS https://coincheck.com/api/rate/$2 | jq '.rate | tonumber'
;;
"bitbank" )
  curl -X GET --header 'Accept: application/json' 'https://public.bitbank.cc/$2/ticker' | jq '.data.last | tonumber'
;;
"poloniex" )
  curl -sS https://poloniex.com/public?command=returnTicker | jq --arg res $2 '.$1.last | tonumber'
;;
"zaif" )
  curl -Ss https://api.zaif.jp/api/1/ticker/$2 | jq .last
;;
"bittrex" )
  curl -sS https://bittrex.com/api/v1.1/public/getticker?market=$2 | jq '.result.Last'
;;
esac
