var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var app = express();

var price = new Object();
price.zaif = new Object();
price.zaif.btc = new Object();
price.zaif.jpy = new Object();
price.bitflyer = new Object();
price.bitflyer.btc = new Object();
price.bitflyer.jpy = new Object();
price.coincheck = new Object();
price.coincheck.btc = new Object();
price.coincheck.jpy = new Object();
price.bitbank = new Object();
price.bitbank.btc = new Object();
price.bitbank.jpy = new Object();
price.bittrex = new Object();
price.bittrex.btc = new Object();
price.kraken = new Object();
price.kraken.btc = new Object();
price.kraken.jpy = new Object();
price.poloniex = new Object();
price.poloniex.btc = new Object();
price.bittrex = new Object();
price.bittrex.btc = new Object();
price.cryptopia = new Object();
price.cryptopia.btc = new Object();


var pairList = (function() {
  var listExCoinPair;

  function loadSync(){
    listExCoinPair = new Array();
    var fileListExCoinPair = fs.readdirSync('./list', 'utf8');
    fileListExCoinPair.map((element) => {
      console.log(element);
      var data = JSON.parse(fs.readFileSync('./list/' + element, 'utf8'));
      var exCoinPair = new Object();
      exCoinPair['name'] = element;
      exCoinPair['data'] = data;
      listExCoinPair.push(exCoinPair);
    })
  }

  loadSync();

  return {
    reload: function() {
      loadSync();
    },
    get: function() {
      return listExCoinPair;
    }
  }
})();


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

});

app.get('/dump1',(req,res) => {
  res.contentType('application/json');
  res.send(JSON.stringify(price));
});

app.get('/dump2',(req,res) => {
  res.contentType('application/json');
  res.send(JSON.stringify(pairList.get()));
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
  console.log('/list called')
  var fileDataExCoinPair = fs.readdirSync('./data', 'utf8');
  fileDataExCoinPair.forEach((fileNameExCoinPair) => {
    var pairList = JSON.parse(fs.readFileSync('./data/' + fileNameExCoinPair,　'utf8'));
    var writePairList = new Array();
    var writePairListJPY = new Array();
    var writePairListBTC = new Array();
    switch (fileNameExCoinPair) {
      case 'bitflyer_markets.txt':
        pairList.map((element) => {
          if (element.product_code.length < 8 && element.product_code.endsWith('JPY')) {
            writePairListJPY.push(element.product_code);
          }
        })
        fs.writeFile('./list/jpy_bitflyer.txt', JSON.stringify(writePairListJPY), 'utf8');
        pairList.map((element) => {
          if (element.product_code.length < 8 && element.product_code.endsWith('BTC')) {
            writePairListBTC.push(element.product_code);
          }
        })
        fs.writeFile('./list/btc_bitflyer.txt', JSON.stringify(writePairListBTC), 'utf8');
        break;
      case 'zaif_currencypairs.txt':
        pairList.map((element) => {
          if (element.currency_pair.endsWith('jpy')) {
            if (element.currency_pair.indexOf('.') >= 0) {
              writePairListJPY.push(element.currency_pair.replace('.', ''));
            } else {
              writePairListJPY.push(element.currency_pair)
            }
          }
        })
        fs.writeFile('./list/jpy_zaif.txt', JSON.stringify(writePairListJPY), 'utf8');
        pairList.map((element) => {
          if (element.currency_pair.endsWith('btc')) {
            writePairListBTC.push(element.currency_pair)
          }
        })
        fs.writeFile('./list/btc_zaif.txt', JSON.stringify(writePairListBTC), 'utf8');
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

  var pair_bitbank = ["btc_jpy", "xrp_jpy", "ltc_btc", "eth_btc", "mona_jpy", "mona_btc", "bcc_jpy", "bcc_btc"];
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
    var rename;
    if (name.indexOf('cms') >= 0) {
      rename = name.replace('cms', '.cms');
    } else {
      rename = name;
    }
    return 'https://api.zaif.jp/api/1/ticker/' + rename + '_' + base;
  }
  pairList.get().map((pair) => {
    if (pair.name.indexOf('zaif') >= 0) {
      var zaif = pair.data;
      zaif.map((element) => {
        var splitPair = element.split('_');
        setPrice(splitPair[0], splitPair[1], 'zaif', extractPriceFromZaifAPIresponce, buildUrlOfZaifPriceApiFromCurrancyName)
      });
    }
  });
}

var setPriceCoincheck = function() {
  var extractPriceFromCoincheckAPIresponce = function(jsonResponse) {
    return Number(JSON.parse(jsonResponse).rate);
  }
  var buildUrlOfCoincheckPriceApiFromCurrancyName = function(name, base) {
    return 'https://coincheck.com/api/rate/' + name + '_' + base;
  }
  pairList.get().map((pair) => {
    if (pair.name.indexOf('coincheck') >= 0) {
      var Coincheck = pair.data;
      Coincheck.map((element) => {
        var splitPair = element.split('_');
        setPrice(splitPair[0], splitPair[1], 'coincheck', extractPriceFromCoincheckAPIresponce, buildUrlOfCoincheckPriceApiFromCurrancyName)
      });
    }
  });
}


var setPriceBitbank = function() {
  var extractPriceFromBitbankAPIresponce = function(jsonResponse) {
    return Number(JSON.parse(jsonResponse).data.last);
  }
  var buildUrlOfBitbankkPriceApiFromCurrancyName = function(name, base) {
    return 'https://public.bitbank.cc/' + name + '_' + base + '/ticker';
  }
  pairList.get().map((pair) => {
    if (pair.name.indexOf('bitbank') >= 0) {
      var bitbank = pair.data;
      bitbank.map((element) => {
        var splitPair = element.split('_');
        setPrice(splitPair[0], splitPair[1], 'bitbank', extractPriceFromBitbankAPIresponce, buildUrlOfBitbankkPriceApiFromCurrancyName)
      });
    }
  });
}

var server = app.listen(3000,() => {
  console.log('Server is running!')
});


var setPriceInterval = function() {
  setPriceZaif();
  setPriceCoincheck();
  setPriceBitbank();
}
setPriceInterval();
setInterval(setPriceInterval, 60 * 1000);
