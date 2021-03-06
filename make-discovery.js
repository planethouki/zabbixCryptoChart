console.log('--step00');

var fs = require('fs');
var masters = JSON.parse(fs.readFileSync('./master.txt', 'utf8'));
var listFiles = fs.readdirSync('./list', 'utf8');

var zabbix = new Object();
zabbix.data = new Array();
// listFiles.map(function(x){console.log(x)});
// master.map(function(x){console.log(x)});
console.log(masters);
console.log(listFiles);

console.log('--step01');

// var baseCurrency = masters[0].substring(1).replace('\"','');
// var marketCurrency = masters[0];
// console.log('marketCurrency: ' + marketCurrency);
// console.log('length: ' + marketCurrency.length);

// var allMarketPairs = new Object();
// allMarketPairs['{#SEQ}'] = 0;
// allMarketPairs['{#NAME}'] = 'NULL';
// listFiles.forEach(function(listFile){
//   allMarketPairs['{#' + listFile.replace('.txt', '}')] = '';
// });
// zabbix.data.push(allMarketPairs);

masters.forEach(function(marketCurrency, seq){
  console.log('--step01 of : ' + marketCurrency);
  var marketPairs = new Object();
  marketPairs['{#SEQ}'] = seq + 1;
  marketPairs['{#NAME}'] = marketCurrency;

  listFiles.forEach(function(listFile, seqFile){
    //console.log(listFile);
    if (listFile.toUpperCase().startsWith(marketCurrency)) {
      // marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = marketCurrency + '_' + 'null' + '_' + listFile;
      marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = 'null' + seq + '-' + seqFile;
    } else {
      var oneMarketList = JSON.parse(fs.readFileSync('./list/'+listFile, 'utf8'));
      // console.log((marketPair));
      var findExistPair = oneMarketList.filter(function(oneMarket){
        if (oneMarket.toUpperCase().startsWith(marketCurrency) || oneMarket.toUpperCase().endsWith(marketCurrency)){
          // console.log(listFile + ' ' + x);
          return oneMarket;
        }
      })
      findExistPair.push('null' + seq + '-' + seqFile);
      marketPairs['{#' + listFile.replace('.txt', '}').toUpperCase()] = findExistPair[0];

    }
  })
  console.log(marketPairs);
  zabbix.data.push(marketPairs);
});



console.log('--step02');

// console.log(zabbix);
console.log(JSON.stringify(zabbix));

// fs.readFileSync('./list/btc_coincheck.txt', 'utf8').split('\n').map(function(x){console.log(x)});


fs.writeFileSync("./zabbixCryptoDiscovery.txt", JSON.stringify(zabbix), 'utf8');

console.log('--step03');


process.exit();
