'use strict';
const fs = require('fs');
const { mainModule } = require('process');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const map = new Map();
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (map.has(prefecture)) {
        if (year === 2015) {
            map.set(prefecture, popu / map.get(prefecture));
        } else if (year === 2010) {
            map.set(prefecture, map.get(prefecture) / popu);
        }
    } else if (prefecture !== '都道府県名') {
        map.set(prefecture, popu);
    }
});
rl.on('close', () => {
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1] - pair1[1];
    });
    const rankingString = rankingArray.map(([key, value]) => {
        return (
            key + ':' +
            '変化率:' + value
        );
    });
    console.log(rankingString);
})