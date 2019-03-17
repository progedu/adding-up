'use strict';
const fs = require('fs');  // Node.js のファイル操作モジュールを呼び出す
const readline = require('readline');  // Node.js のファイルを一行ずつ読むモジュールを呼び出す
const rs = fs.ReadStream('./popu-pref.csv');  // CSV を読む用の stream
const rl = readline.createInterface({ 'input': rs, 'output': {} });  // stream のインタフェース
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {  // 一行読むごとに
    const columns = lineString.split(',');  // 列ごとに文字列を分割して配列に格納
    const year = parseInt(columns[0]);  // 年は列0、整数
    const prefecture = columns[2];  // 都道府県名は列2
    const popu = parseInt(columns[7]);  // 人口は列7、整数
    if (year === 2010 || year === 2015) {  // 2010年か2015年の行だったら
        let value = prefectureDataMap.get(prefecture);  // その都道府県のそれまでのデータ
        if (!value) {  // まだ出てきてなかったら
            value = {  // 初期値を与える
                popu10: 0,  // 2010年の人口は 0
                popu15: 0,  // 2015年の人口は 0
                change: null  // change は null
            };
        }
        if (year === 2010) {  // 2010年の行だったら
            value.popu10 += popu;  // 2010年の値に足す（男女どっちかの人口を）
        }
        if (year === 2015) {  // 2015年の行だったら
            value.popu15 += popu;  // 2015年の値に足す（男女どっちかの人口を）
        }
        prefectureDataMap.set(prefecture, value);  // 人口を足した状態の値に更新する
    }
});
rl.on('close', () => {  // 全行読み終わったときに
    for (let [key, value] of prefectureDataMap) {  // Map の全要素について
        value.change = value.popu15 / value.popu10;  // change を popu15 / popu10 に変更する
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {  // Map から二次元配列を生成、並び替え
        return pair1[1].change - pair2[1].change;  // 大きい順にするので、右が大きい時に正になる比較関数
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {  // 二次元配列を文字列配列に変換
        return (i + 1) + '位  ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);  // 文字列配列を出力
});
