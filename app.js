'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    let i = 0;
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
/*
    console.log(year);
    console.log(prefecture);
    console.log(popu);
*/
//rl.on('close', function () {
rl.on('close', () => {
    //頭から繰り返し
    for(let[key,value] of prefectureDataMap){
            value.change = (value.popu15 - value.popu10)/value.popu10; 
    }

    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        //console.log("pair1[0]:" + pair1[0] + ",pair1[1].change:" +pair1[1].change*100 + " / pair2[0]:" + pair2[0] + ",pair2[1].change:" +pair2[1].change*100);
        //昇順の書き方。第1引数の方が大きいと正の値を返し、第1→第2を第2→第1の順にひっくり返す。
        return pair1[1].change - pair2[1].change;
    });

/*
    const rankingString = rankingArray.map(([key, value]) => {
        return key;
    });
*/
    const rankingString = rankingArray.map(([key, value], i) => {
        return '減少率第' + ++i + '位・・・' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    
    console.log(rankingString);
    //console.log(rankingArray);
});