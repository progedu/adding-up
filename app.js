'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output':{}});

const prefectureDataMap = new Map();    // keyが都道府県、valueが集計データ

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popular = columns[3];
    if((year === 2010) || (year === 2015)){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {popular10: 0, popular15: 0, change: null};
        }

        if(year === 2010){
            value.popular10 = popular;
        }
        if(year === 2015){
            value.popular15 = popular;
        }

        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {
    for(let [key, value] of prefectureDataMap){
        value.change = value.popular15 / value.popular10;
    }

    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });

    const rankingStrings = rankingArray.map(([key, value], i) => {
        return (i + 1) + '位 ' + key + ': ' + value.popular10 + '=>' + value.popular15 + ' 変化率:' + value.change;
    })

    console.log(rankingStrings);
});
