'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//key:都道府県　value:集計データのオブジェクト
const prefectureDateMap = new Map();
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    //配列[0]の値を数値に帰るparseInt
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    //配列[0]の値を数値に帰るparseInt
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        //連想配列を作る
        let value = prefectureDateMap.get(prefecture);
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
            prefectureDateMap.set(prefecture, value);

    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDateMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return key + ':' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;

    });
    console.log(rankingStrings);
});