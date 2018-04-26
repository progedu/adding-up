'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
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
        map.set(prefecture, value);
    }
});

rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {

        const maxCityNameLen = 4;
        const maxPopuLen     = 7;

        let cityName  = pair[0];
        let strPopu10 = String(pair[1].popu10);
        let strPopu15 = String(pair[1].popu15);

        // 長さを調整して整形（県名）
        let shortLen = maxCityNameLen - cityName.length;
        for (let i = 0; i < shortLen; i++) {
            cityName = cityName + '　';
        }

        // 長さを調整して整形（2010年人口）
        shortLen = maxPopuLen - strPopu10.length;
        for (let i = 0; i < shortLen; i++) {
            strPopu10 = ' ' + strPopu10;
        }

        // 長さを調整して整形（2015年人口）
        shortLen = maxPopuLen - strPopu15.length;
        for (let i = 0; i < shortLen; i++) {
            strPopu15 = ' ' + strPopu15;
        }

        return cityName + ': ' + strPopu10 + '=>' + strPopu15 + '  変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});

rl.resume();