'use strict';

// モジュール読み込み
const fs = require('fs');
const readline = require('readline');

const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// ファイルからデータを読み取る
rl.on('line', (lineString) => {
    const columns = lineString.split(',');

    const year = parseInt(columns[0]); // 集計年
    const prefecture = columns[2]; // 都道府県名
    const popu = parseInt(columns[7]); // 15〜19歳（人）

    // 2010 年と 2015 年のデータを選ぶ
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
rl.resume();
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        // 都道府県ごとの変化率を計算する
        value.change = value.popu15 / value.popu10;
    }
    // 変化率ごとに並べる
    const rankingArray = Array.from(map).sort((pare1, pare2) => {
        return pare2[1].change - pare1[1].change;
    });
    // 並べられたものを表示する
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率: ' + pair[1].change;
    })
    console.log(rankingStrings);
});
