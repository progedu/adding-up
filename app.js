'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();// key : 都道府県 value　：　集計データオブジェクト
rl.on('line', (lineString) => {
    const colums = lineString.split(',');
    const year = parseInt(colums[0]);
    const prefecture = colums[2];
    const popu = parseInt(colums[7]);
    if (year === 2010 || year === 2015){
        let value = map.get(prefecture);
        if (!value){
            value = {
                popu10 : 0,
                popu15 : 0,
                change : null 
            };
        }
        if (year === 2010){
            value.popu10 += popu;
        }
        if (year === 2015){
            value.popu15 += popu;
        }
        map.set(prefecture,value);
    }
});
rl.resume();
rl.on('close',() => {
    for (let pair of map){
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((pair1,pair2) => {
        return pair2+ 1 + '位 ' + pair1[0] + ': ' + pair1[1].popu10 + '=>' + pair1[1].popu15 + ' 変化率:' + pair1[1].change
    });
    console.log(rankingStrings);
});