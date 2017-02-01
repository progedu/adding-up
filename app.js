'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input':rs, 'output':{}});
const map = new Map();// key: 都道府県 value: 集計データのオブジェクト
rl.on('line',(lineString) => {
    //console.log(lineString);

    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    if(year === 2010 || year === 2015){
        let value = map.get(prefecture);

        if(!value){
            value = {
                p10:0,
                p15:0,
                change:null
            };

        }

        if(year === 2010){
            //value.p10 = value.p10 + popu;
            value.p10 += popu;
        }

        if(year === 2015){
            value.p15 += popu;
        }


        map.set(prefecture,value);
        // console.log(year);
        // console.log(prefecture);
        // console.log(popu);
    }
});

rl.resume();

rl.on('close', () => {
    //console.log(map);

    for(let pair of map){
        //console.log(pair[0]);
        const value = pair[1];
        value.change = value.p15 / value.p10;
    }

    const rankingArray = Array.from(map).sort((p1, p2) => {
        //増えた順にランキングを並べ替え
        //return p2[1].change - p1[1].change;

        //減った順にランキングを並び替え
        return p1[1].change - p2[1].change;

    });

    const rankingStrings = rankingArray.map((p,i) => {

        return i+1 + '位  ' + p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change;

    });


    console.log(rankingStrings);


    //console.log(rankingArray);

    //console.log(map);
});
