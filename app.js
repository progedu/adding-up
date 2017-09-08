'use strict';
//Node.jsのモジュール
const fs = require('fs'); //ファイルシステムを扱う
const readline = require('readline');　//ファイルから一行ずつ読み込む
const rs = fs.ReadStream('./popu-pref.csv');　//情報の流れを読む？
const rl = readline.createInterface({ 'input': rs, 'output': {} });　//インターフェースの作成
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト
//ファイルからデータを抜き出す

//「集計年」「都道府県」「15〜19歳の人口」の順
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);
        if (!value) {
            value = {
                p10: 0,
                p15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.p10 += popu;
        }
        if (year === 2015) {
            value.p15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.p15 / value.p10;
    }
    const rankingArray = Array.from(map).sort((p1, p2) => {
        return p2[1].change - p1[1].change;
    });
    const rankingStrings = rankingArray.map((p) => {
        return p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change;
    });

    console.log(rankingStrings);
});