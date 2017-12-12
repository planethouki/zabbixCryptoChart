var express = require('express');

var app = express();

app.get("/discovery.json",(req,res) => {
  res.contentType('application/json');
  var dis = new Object();
  dis.data = new Array();
  dis.data[0] = {
    "{#SEQ}": 1,
    "{#NAME}": "BTC",
    "{#BTC_BITBANK}": "null0-0",
    "{#BTC_BITTREX}": "null0-1",
    "{#BTC_COINCHECK}": "null0-2",
    "{#BTC_POLONIEX}": "null0-3",
    "{#BTC_ZAIF}": "null0-4",
    "{#ETH_BITTREX}": "null0-5",
    "{#ETH_POLONIEX}": "null0-6",
    "{#JPY_BITBANK}": "btc_jpy",
    "{#JPY_COINCHECK}": "btc_jpy",
    "{#JPY_ZAIF}": "btc_jpy",
    "{#USDT_BITTREX}": "USDT-BTC",
    "{#USDT_POLONIEX}": "USDT_BTC"
  };
  var disJSON = JSON.stringify(dis);
  res.send(disJSON);
});

var server = app.listen(3000,() => {
  console.log('Server is running!')
});
