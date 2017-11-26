'use strict';
// ファイル読み込み用モジュール呼び出し
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {} });
const map = new Map(); // key: 都道府県名 value: 集計データのオブジェクト
// 1行読み込まれたら実行する
rl.on('line', (lineString) => {
    // 必要な要素を抜き出す（年、都道府県名、15〜19歳の人口）
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    // 2010と2015年の場合、以下の処理を実施
    if(year == 2010 || year == 2015){
        let value = map.get(prefecture);
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year == 2010){
            value.popu10 += popu;
        }
        if(year == 2015){
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close',() => {
    for(let pair of map){
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((pair, rank) => {
        return (rank+1) + "-" + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});