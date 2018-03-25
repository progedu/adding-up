'use strict'
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv')
const rl = readline.createInterface({
  input: rs,
  output: {}
});
const map = new Map();

rl.on ('line', (lineString) => {
     const column = lineString.split(',');
     const year = parseInt(column[0]);
     const prefecture = column[2];
     const popu = parseInt(column[7]);
     if (year === 2010 || year === 2015) {
       let value = map.get(prefecture);
       if (!value) {
           value = {
               popu10: 0,
               popu15: 0,
               change: null
           };
       }
    if (year === 2010) {
        value.popu10 += popu;
    } 
    if (year === 2015) {
        value.popu15 += popu;
    }
    map.set(prefecture, value);
    
  }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair4, pair5) => {
    return pair4[1].change - pair5[1].change;
    });
    const rankingString = rankingArray.map ((pair, i) => {
        return (i+1) + '位' + pair[0] + ':' + pair[1].popu10 + '=>' + pair[1].popu15 + '変化率:' + pair[1].change;
    }

    )
    console.log(rankingString);
}
);