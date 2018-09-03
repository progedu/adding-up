'use strict';
//コマンドライン引数の数値で人口が増えた割合順か減った割合順にするかを決める
const sort = process.argv[2] || 0;
//Node.jsに用意されたモジュール呼び出し
const fs = require('fs');   //ファイルを扱うモジュール
const readline = require('readline');   //ファイルを一行ずつ読むモジュール

const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs,'output':{} });
const prefectureDataMap = new Map(); //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010){
            value.popu10 += popu;
        }
        if(year === 2015){
            value.popu15 += popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        if(parseInt(sort) === 1){   //コマンドライン引数に「1」が入力されたら人が増えた割合順
            return pair2[1].change - pair1[1].change;
        }else{  //それ以外は人が減った割合順
            return pair1[1].change - pair2[1].change;
        }
    });
    const rankingString = rankingArray.map(([key, value],i) => {
        return i+1 + '位: ' + key + ': ' + value.popu10 + '=>' + value. popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingString);
});
