#!/bin/bash

script_dir=$(cd $(dirname $BASH_SOURCE); pwd)
cd $script_dir


#btc
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("BTC"))) | sort_by(.BaseVolume) | reverse | [.[].MarketName]' > list/btc_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("BTC")))' > list/btc_poloniex.txt
cat data/zaif_currencypairs.txt | jq 'map(select(.currency_pair|endswith("btc"))) | sort_by(.seq) | [.[].currency_pair]' > list/btc_zaif.txt
echo -e '["ltc_btc","eth_btc","mona_btc","bcc_btc"]' | jq '.' > list/btc_bitbank.txt
echo -e '["eth_btc","etc_btc","lsk_btc","fct_btc","xmr_btc","rep_btc","xrp_btc","zec_btc","xem_btc","ltc_btc","dash_btc","bch_btc"]' | jq '.' > list/btc_coincheck.txt
cat data/bitflyer_markets.txt | jq '. | map(select(.product_code | length<8)) | map(select(.product_code | endswith("BTC"))) | [.[].product_code]' > list/btc_bitflyer.txt

#jpy
cat data/zaif_currencypairs.txt | jq 'map(select(.currency_pair|endswith("jpy"))) | sort_by(.seq) | [.[].currency_pair]' > list/jpy_zaif.txt
echo -e '["btc_jpy","xrp_jpy","bcc_jpy","mona_jpy"]' | jq '.' > list/jpy_bitbank.txt
echo -e '["btc_jpy","eth_jpy","etc_jpy","dao_jpy","lsk_jpy","fct_jpy","xmr_jpy","rep_jpy","xrp_jpy","zec_jpy","xem_jpy","ltc_jpy","dash_jpy","bch_jpy"]' | jq '.' > list/jpy_coincheck.txt
cat data/bitflyer_markets.txt | jq '. | map(select(.product_code | length<8)) | map(select(.product_code | endswith("JPY"))) | [.[].product_code]' > list/jpy_bitflyer.txt

#eth
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("ETH"))) | sort_by(.BaseVolume) | reverse | [.[].MarketName]' > list/eth_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("ETH")))' > list/eth_poloniex.txt

#usdt
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("USDT"))) | sort_by(.BaseVolume) | reverse | [.[].MarketName]' > list/usdt_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("USDT")))' > list/usdt_poloniex.txt
