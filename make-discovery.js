console.log('--step00');

var fs = require('fs');
var masters = fs.readFileSync('./master.txt', 'utf8').split('\n');
var listFiles = fs.readdirSync('./list', 'utf8');

// listFiles.map(function(x){console.log(x)});
// master.map(function(x){console.log(x)});

console.log('--step01');

master = masters[0].substring(1).replace('\"','');
console.log(master);

for (i in listFiles){
  if (listFiles[i].toUpperCase().indexOf(master) == -1) {
    // pairs = fs.readFileSync('./list/'+listFiles[i], 'utf8').split('\n');
    console.log(listFiles[i]);
  }
}

console.log('--step02');

// fs.readdirSync('./list', 'utf8').map(function(x){console.log(x)});
fs.readdirSync('./list', 'utf8').map(
  function(x){
    y = fs.readFileSync('./list/' + x, 'utf8');
    read(y);
  }
);


// fs.readFileSync('./list/btc_coincheck.txt', 'utf8').split('\n').map(function(x){console.log(x)});


fs.writeFile("./test.txt", "test OK!", function (err) {
  if (err) {
      throw err;
  }
});


function read(x){
  // x.split('\n').map(function(y){console.log(y)});
}
