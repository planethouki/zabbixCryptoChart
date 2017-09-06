console.log('--step00');

var fs = require('fs');
var masters = JSON.parse(fs.readFileSync('./master.txt', 'utf8'));
var listFiles = fs.readdirSync('./list', 'utf8');

var zabbix = new Object();
zabbix.data = new Array();
// listFiles.map(function(x){console.log(x)});
// master.map(function(x){console.log(x)});
// console.log(typeof(masters));

console.log('--step01');

// var baseCurrency = masters[0].substring(1).replace('\"','');
// var marketCurrency = masters[0];
// console.log('marketCurrency: ' + marketCurrency);
// console.log('length: ' + marketCurrency.length);
var allMarketPairs = new Object();
allMarketPairs['{#SEQ}'] = 0;
allMarketPairs['{#NAME}'] = 'NULL';
listFiles.forEach(function(listFile){
  allMarketPairs['{#' + listFile.replace('.txt', '}')] = '';
});
zabbix.data.push(allMarketPairs);

masters.forEach(function(marketCurrency, seq){
  // console.log('--step01.1')
  // console.log('marketCurrency: ' + marketCurrency);
  var marketPairs = new Object();
  marketPairs['{#SEQ}'] = seq + 1;
  marketPairs['{#NAME}'] = marketCurrency;

  listFiles.forEach(function(listFile){
    if (listFile.toUpperCase().indexOf(marketCurrency) == -1) {

      marketPair = JSON.parse(fs.readFileSync('./list/'+listFile, 'utf8'));
      // console.log((marketPair));
      marketPair.forEach(function(x){
        if (x.toUpperCase().indexOf(marketCurrency) != -1){
          // console.log(listFile + ' ' + x);
          marketPairs['{#' + listFile.replace('.txt', '}')] = x;
        }
      })
    }
  })
  zabbix.data.push(marketPairs);
});



console.log('--step02');

// console.log(zabbix);
// console.log(JSON.stringify(zabbix));

// fs.readFileSync('./list/btc_coincheck.txt', 'utf8').split('\n').map(function(x){console.log(x)});


fs.writeFile("./zabbixCryptoDiscovery.txt", JSON.stringify(zabbix), function (err) {
  if (err) {
      throw err;
  }
});

console.log('--step03');
