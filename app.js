'use strict';

// fs(File System) モジュールを読み込んで使えるようにする
const fs = require('fs');
// readline モジュールを読み込んで使えるようにする
const readline = require('readline');

// popu-pref.csv をファイルとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
// readline モジュールに rs を設定する
const rl = readline.createInterface({ input: rs, output: {} });

const prefectureDataMap = new Map();// key: 都道府県 value: 集計データのオブジェクト

// popu-pref.csv のデータを１行ずつ読み込んで、設定された関数を実行する
rl.on('line', lineString => {
    // データ配列に分割
    const colums = lineString.split(',');
    const year = parseInt(colums[0]);// 年
    const prefecture = colums[1];// 都道府県名
    const popu = parseInt(colums[3]);// 15~19歳の人口
    if (year === 2010 || year === 2015) {
        // 都道府県ごとのデータを作る
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            // データがなかったらデータを初期化
            value= {
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

rl.on('close', () => {
    for (let [key, data] of prefectureDataMap) {
        data.change = (data.popu15 / data.popu10);
    }
    const rankingArray = Array.from(prefectureDataMap);
    const length = rankingArray.length;
    for (let i = 0; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            if (rankingArray[i][1].change - rankingArray[j][1].change < 0) {
                let tmp = rankingArray[i];
                rankingArray[i] = rankingArray[j];
                rankingArray[j] = tmp;
            }
        }
    }
    // データを整形
    const rankingsStrings = rankingArray.map(([key, value],i) => {
        return (`第${i+1}位 ${key} (人口推移: ${value.popu10}人 => ${value.popu15}人 変化率: ${value.change})`);
    });
    console.log('＜2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング＞');
    console.log(rankingsStrings);
});