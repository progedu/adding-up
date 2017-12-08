'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// rl オブジェクトで line イベントが発生したら無名関数を呼び、
// コンソールに引数 lineString の内容を出力
rl.on('line', (lineString) => {
//    console.log(lineString);
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) { // その県のデータを処理するのが初めてであれば
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
    console.log(map);
});
