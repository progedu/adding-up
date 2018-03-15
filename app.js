'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {} });
const map = new Map(); //key: 都道府県 value: 集計データのオブジェクト(値３つ　2010年の人口合計,2015年の人口合計,人口変化率)は、後に出てくるmap.setで連想配列に入れる
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                popu2010: 0,
                popu2015: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu2010 += popu;
        }
        if (year === 2015){
            value.popu2015 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu2015/value.popu2010;
    }
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((pair,i) => {
        return (i+1)+'位 ' + pair[0] + ': ' + pair[1].popu2010 + '=>' + pair[1].popu2015 + ' 変化率:' + pair[1].change; //ここの'=>'は変化を示す矢印
    });
    console.log(rankingStrings);
});