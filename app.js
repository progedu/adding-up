'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {}});
const map = new Map();
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const pref = columns[2];
    const popu = columns[7];
    if (year == 2010 || year == 2015) {
        let value = map.get(pref);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            }
        }
        if (year == 2010) { value.popu10 = popu; }
        if (year == 2015) { value.popu15 = popu; }
        map.set(pref, value);
    }
})
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingAry = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    })
    const rankingStr = rankingAry.map((pair, i) => {
        let rank = i + 1;
        return rank + '位/ ' + pair[0] + ': ' + pair[1].popu10 + '=> ' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    })
    console.log(rankingStr);
})