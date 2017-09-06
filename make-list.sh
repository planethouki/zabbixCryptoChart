#!/bin/bash



#btc
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("BTC"))) | sort_by(.BaseVolume) | reverse | .[].MarketName' > list/btc_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("BTC"))) | .[]' > list/btc_poloniex.txt
cat data/zaif_currencypairs.txt | jq 'map(select(.currency_pair|endswith("btc"))) | sort_by(.seq) | .[].currency_pair' > list/btc_zaif.txt
echo -e '"ltc_btc"\n"eth_btc"\n"mona_btc"\n"bcc_btc"' > list/btc_bitbank.txt
echo -e '"eth_btc"\n"etc_btc"\n"lsk_btc"\n"fct_btc"\n"xmr_btc"\n"rep_btc"\n"xrp_btc"\n"zec_btc"\n"xem_btc"\n"ltc_btc"\n"dash_btc"\n"bch_btc"' > list/btc_coincheck.txt

#jpy
cat data/zaif_currencypairs.txt | jq 'map(select(.currency_pair|endswith("jpy"))) | sort_by(.seq) | .[].currency_pair' > list/jpy_zaif.txt
echo -e '"btc_jpy"\n"xrp_jpy"\n"bcc_jpy"\n"mona_jpy"' > list/jpy_bitbank.txt
echo -e '"btc_jpy"\n"eth_jpy"\n"etc_jpy"\n"dao_jpy"\n"lsk_jpy"\n"fct_jpy"\n"xmr_jpy"\n"rep_jpy"\n"xrp_jpy"\n"zec_jpy"\n"xem_jpy"\n"ltc_jpy"\n"dash_jpy"\n"bch_jpy"' > list/jpy_coincheck.txt

#eth
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("ETH"))) | sort_by(.BaseVolume) | reverse | .[].MarketName' > list/eth_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("ETH"))) | .[]' > list/eth_poloniex.txt

#usdt
cat data/bittrex_getmarketsummaries.txt | jq '.result | map(select(.MarketName|startswith("USDT"))) | sort_by(.BaseVolume) | reverse | .[].MarketName' > list/usdt_bittrex.txt
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("USDT"))) | .[]' > list/usdt_poloniex.txt

#xmr
cat data/poloniex_returnTicker.txt | jq '. | keys | map(select(.|startswith("XMR"))) | .[]' > list/xmr_poloniex.txt
