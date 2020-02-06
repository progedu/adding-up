'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); //都道府県hash
rl.on('line', (lineString) => {
    let year,pref,_,popu;
    [year,pref,_,popu] = lineString.split(',');
    year = parseInt(year);
    popu = parseInt(popu);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(pref) || {popu10:0, popu15:0, change: null};
        if (year === 2010) {value.popu10 = popu};
        if (year === 2015) {value.popu15 = popu};
        prefectureDataMap.set(pref,value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const result = Array.from(prefectureDataMap).sort(([_1,v1], [_2,v2]) => {
        return v1.change - v2.change; //変化率_昇順ソート
    }).map(([key, value],i) => {
        // 1位:北海道: 10000=>10000 変化率:0.9999
        return `${i+1}位:${key}: ${value.popu10}=>${value.popu15} 変化率:${value.change}`;
    });
    console.log(result);
});
