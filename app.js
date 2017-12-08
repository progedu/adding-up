'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

// rl オブジェクトで line イベントが発生したら無名関数を呼び、
// コンソールに引数 lineString の内容を出力
rl.on('line', (lineString) => {
//    console.log(lineString);
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        console.log(year);
        console.log(prefecture);
        console.log(popu);
    }
});
rl.resume();
