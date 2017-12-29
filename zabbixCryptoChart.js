var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();

var price = new Object();

price.zaif = new Object();
price.zaif.btc = new Object();
price.zaif.jpy = new Object();

app.get('/discovery',(req,res) => {
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

app.get('/dump',(req,res) => {
  res.contentType('application/json');
  res.send(JSON.stringify(price));
});


app.get('/heartbeat',(req,res) => {
  res.sendStatus(200);
});


app.get('/data',(req,res) => {
  var objArr = [
    {'url':'https://api.bitflyer.jp/v1/markets',
     'file':'bitflyer_markets.txt'},
    {'url':'https://api.zaif.jp/api/1/currency_pairs/all',
     'file':'zaif_currencypairs.txt'},
    {'url':'https://api.kraken.com/0/public/AssetPairs',
     'file':'kraken_assetpairs.txt'},
    {'url':'https://bittrex.com/api/v1.1/public/getmarketsummaries',
     'file':'bittrex_getmarketsummaries.txt'},
    {'url':'https://poloniex.com/public?command=returnTicker',
     'file':'poloniex_returnTicker.txt'},
    {'url':'https://www.cryptopia.co.nz/api/GetMarkets',
     'file':'cryptopia_getmarkets.txt'}
  ];
  objArr.map(writeData);
  res.sendStatus(200);
});

var writeData = function(obj) {
  var htmlBody = '';
  var url = obj.url;
  https.get(url, res => {
      res.setEncoding('utf8');
      res.on('data', function(resChunk){
          htmlBody += resChunk;
      });
      res.on('end', function(resHttpOn){
        fs.writeFile('data/' + obj.file ,htmlBody,'utf8');
      });
  }).on('error', function(e){
      console.log(e.message);
  });
}

app.get('/list',(req,res) => {
  var fileListExCoinPair = fs.readdirSync('./data', 'utf8');
  fileListExCoinPair.forEach((fileNameExCoinPair) => {
    var pairList = JSON.parse(fs.readFileSync('./data/' + fileNameExCoinPair,　'utf8'));
    var writePairList = new Array();
    switch (fileNameExCoinPair) {
      case 'bitflyer_markets.txt':
        pairList.map((element) => {
          if (element.product_code.length < 8 && element.product_code.endsWith('JPY')) {
            writePairList.push(element.product_code);
          }
        })
        fs.writeFile('./list/jpy_bitflyer.txt', JSON.stringify(writePairList), 'utf8');
        pairList.map((element) => {
          if (element.product_code.length < 8 && element.product_code.endsWith('BTC')) {
            writePairList.push(element.product_code);
          }
        })
        fs.writeFile('./list/btc_bitflyer.txt', JSON.stringify(writePairList), 'utf8');
        break;
      case 'zaif_currencypairs.txt':
        pairList.map((element) => {
          if (element.currency_pair.endsWith('jpy')) {
            writePairList.push(element.currency_pair)
          }
        })
        fs.writeFile('./list/jpy_zaif.txt', JSON.stringify(writePairList), 'utf8');
        pairList.map((element) => {
          if (element.currency_pair.endsWith('btc')) {
            writePairList.push(element.currency_pair)
          }
        })
        fs.writeFile('./list/btc_zaif.txt', JSON.stringify(writePairList), 'utf8');
        break;
      case 'kraken_assetpairs.txt':
        writePairList = Object.keys(pairList.result).filter((element) => {
          if (element.endsWith('JPY')) return true;
        })
        fs.writeFile('./list/jpy_kraken.txt', JSON.stringify(writePairList), 'utf8');
        writePairList = Object.keys(pairList.result).filter((element) => {
          if (element.endsWith('XBT')) return true;
        })
        fs.writeFile('./list/btc_kraken.txt', JSON.stringify(writePairList), 'utf8');
        break;
      case 'bittrex_getmarketsummaries.txt':
        pairList.result.map((element) => {
          if (element.MarketName.startsWith('BTC')) {
            writePairList.push(element.MarketName);
          }
        })
        fs.writeFile('./list/btc_bittrex.txt', JSON.stringify(writePairList), 'utf8');
        break;
      case 'poloniex_returnTicker.txt':
        writePairList = Object.keys(pairList).filter((element) => {
          if (element.startsWith('BTC')) return true;
        })
        fs.writeFile('./list/btc_poloniex.txt', JSON.stringify(writePairList), 'utf8')
        break;
      case 'cryptopia_getmarkets.txt':
        pairList.Data.map((element) => {
          if (element.Label.endsWith('BTC')) {
            writePairList.push(element.Label);
          }
        })
        fs.writeFile('./list/btc_cryptopia.txt', JSON.stringify(writePairList, 'utf8'));
        break;
    }
  })

  var pair_bitbank = ["btc_jpy", " xrp_jpy", " ltc_btc", " eth_btc", " mona_jpy", " mona_btc", " bcc_jpy", " bcc_btc"];
  var jpy_bitbank = pair_bitbank.filter((element)=>{if(element.endsWith('jpy')) return true;})
  var btc_bitbank = pair_bitbank.filter((element)=>{if(element.endsWith('btc')) return true;})
  fs.writeFile('./list/jpy_bitbank.txt', JSON.stringify(jpy_bitbank), 'utf8');
  fs.writeFile('./list/btc_bitbank.txt', JSON.stringify(btc_bitbank), 'utf8');

  var jpy_coincheck = ["btc_jpy","eth_jpy","etc_jpy","dao_jpy","lsk_jpy","fct_jpy","xmr_jpy","rep_jpy","xrp_jpy","zec_jpy","xem_jpy","ltc_jpy","dash_jpy","bch_jpy"];
  var btc_coincheck = ["eth_btc","etc_btc","lsk_btc","fct_btc","xmr_btc","rep_btc","xrp_btc","zec_btc","xem_btc","ltc_btc","dash_btc","bch_btc"];
  fs.writeFile('./list/jpy_coincheck.txt', JSON.stringify(jpy_coincheck), 'utf8');
  fs.writeFile('./list/btc_coincheck.txt', JSON.stringify(btc_coincheck), 'utf8');


  res.sendStatus(200);
});


app.get('/price',(req,res) => {
  res.contentType('text/plain');
  var name = '';
  var base = '';
  var ex = '';
  if ((req.query.ex) && (price[req.query.ex])) {
    ex = req.query.ex;
    if ((req.query.base) && (price[ex][req.query.base])) {
      base = req.query.base;
      if ((req.query.name) && (price[ex][base][req.query.name])) {
        name = req.query.name;
        res.send(price[ex][base][name] + '');
      } else {
        console.log('Bad name');
        res.sendStatus(400);
      }
    } else {
      console.log('Bad base');
      res.sendStatus(400);
    }
  } else {
    console.log('Bad ex');
    res.sendStatus(400);
  }

});


var setPrice = function(name, base, ex, extractFunc, urlFunc) {
  var htmlBody = '';
  var url = urlFunc(name, base);
  https.get(url, res => {
      res.setEncoding('utf8');
      res.on('data', function(resChunk){
          htmlBody += resChunk;
      });
      res.on('end', function(resHttpOn){
        price[ex][base][name] = extractFunc(htmlBody);
        // console.log(price[ex][base][name]);
      });
  }).on('error', function(e){
      console.log(e.message);
  });
}


var setPriceZaif = function() {
  var extractPriceFromZaifAPIresponce = function(jsonResponse) {
    return JSON.parse(jsonResponse).last;
  }
  var buildUrlOfZaifPriceApiFromCurrancyName = function(name, base) {
    return 'https://api.zaif.jp/api/1/ticker/' + name + '_' + base;
  }
  setPrice('btc', 'jpy', 'zaif', extractPriceFromZaifAPIresponce, buildUrlOfZaifPriceApiFromCurrancyName);
  setPrice('xem', 'jpy', 'zaif', extractPriceFromZaifAPIresponce, buildUrlOfZaifPriceApiFromCurrancyName);
}



var server = app.listen(3000,() => {
  console.log('Server is running!')
});



setInterval(setPriceZaif, 5000);
