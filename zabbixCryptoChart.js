var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();

app.get("/discovery",(req,res) => {
  res.contentType('application/json');

  var arrayYourWatchCoins = JSON.parse(fs.readFileSync('./master.txt', 'utf8'));
  var filesCoinExchange = fs.readdirSync('./list', 'utf8');

  var zabbix = new Object();
  zabbix.data = new Array();

  arrayYourWatchCoins.forEach(function(yourWatchCoin, seq){
    console.log('--step01 of : ' + yourWatchCoin);
    var marketPairs = new Object();
    marketPairs['{#SEQ}'] = seq + 1;
    marketPairs['{#NAME}'] = yourWatchCoin;

    filesCoinExchange.forEach(function(listFile, seqFile){
      //console.log(listFile);
      if (listFile.toUpperCase().startsWith(yourWatchCoin)) {
        // marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = marketCurrency + '_' + 'null' + '_' + listFile;
        marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = 'null' + seq + '-' + seqFile;
      } else {
        var oneMarketList = JSON.parse(fs.readFileSync('./list/'+listFile, 'utf8'));
        // console.log((marketPair));
        var findExistPair = oneMarketList.filter(function(oneMarket){
          if (oneMarket.toUpperCase().startsWith(yourWatchCoin) || oneMarket.toUpperCase().endsWith(yourWatchCoin)){
            // console.log(listFile + ' ' + x);
            return oneMarket;
          }
        })
        findExistPair.push('null' + seq + '-' + seqFile);
        marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = findExistPair[0];

      }
    })
    // console.log(marketPairs);
    zabbix.data.push(marketPairs);
  });

  res.send(JSON.stringify(zabbix));




  // var dis = new Object();
  // dis.data = new Array();
  // dis.data[0] = {
  //   "{#SEQ}": 1,
  //   "{#NAME}": "BTC",
  //   "{#BTC_BITBANK}": "null0-0",
  //   "{#BTC_BITTREX}": "null0-1",
  //   "{#BTC_COINCHECK}": "null0-2",
  //   "{#BTC_POLONIEX}": "null0-3",
  //   "{#BTC_ZAIF}": "null0-4",
  //   "{#ETH_BITTREX}": "null0-5",
  //   "{#ETH_POLONIEX}": "null0-6",
  //   "{#JPY_BITBANK}": "btc_jpy",
  //   "{#JPY_COINCHECK}": "btc_jpy",
  //   "{#JPY_ZAIF}": "btc_jpy",
  //   "{#USDT_BITTREX}": "USDT-BTC",
  //   "{#USDT_POLONIEX}": "USDT_BTC"
  // };
  // var disJSON = JSON.stringify(dis);
  // res.send(disJSON);
});


app.get("/list",(req,res) => {
  var url = 'https://api.zaif.jp/api/1/currency_pairs/all';
  httpsget(url, res);

});

app.get("/price",(req,res) => {
  var url = "https://api.zaif.jp/api/1/ticker/btc_jpy";
  httpsget(url, res);
});


var httpsget = function(url, res) {
  var htmlBody = '';
  https.get(url, (resHttp) => {
      resHttp.setEncoding('utf8');
      resHttp.on('data', function(resChunk){
          htmlBody += resChunk;
      });
      resHttp.on('end', function(resHttpOn){
          console.log(htmlBody);
          res.send(htmlBody);
      });
  }).on('error', function(e){
      console.log(e.message);
  });
};




var server = app.listen(3000,() => {
  console.log('Server is running!')
});
