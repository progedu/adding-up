'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト 
rl.on('line',lineString => {
    //ファイルからデータを抜き出す
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {   //初期値
                popu10: 0,
                popu15: 0,
                change: null
            };
        };
        if (year === 2010) {    //連想配列に保存。次から同じ県のデータが来れば16行目で保存したオブジェクトが取得される
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {  
    for (let [key, value] of prefectureDataMap) {
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // map関数を用いて、Mapの配列を要素[key, value]として受け取り、文字列に変換する処理
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
        );
    });
    console.log(rankingStrings);
});
