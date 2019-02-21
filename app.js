'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map();
rl.on('line', (lineString) => {
    // console.log(lineString);
    const column = lineString.split(',');
    const year = parseInt(column[0]);
    const prefecture  = column[2];
    const popu = parseInt(column[7]);
    if (year === 2010 || year == 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (value === void 0) {
            value = {
                popu2010: 0,
                popu2015: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu2010 += popu;
        }
        if (year === 2015) {
            value.popu2015 += popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', function(){
    for(let [key, value] of prefectureDataMap) {
        value.change = value.popu2015 / value.popu2010;
    }
    let _arry = Array.from(prefectureDataMap);
    _arry = _arry.sort(function(a,b){
        return b[1].change - a[1].change;
    });

    let _ranking = _arry.map(function([key, value]){
        return key + ': ' + value.popu2010 + '=>' + value.popu2015 + ' 変化率:' + value.change;
    });
    console.log(_ranking)
})
//rl.resume();