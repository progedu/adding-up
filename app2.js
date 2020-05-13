'use strict';
const fs = require('fs'); //FileSystem　ファイルを扱うためのモジュール
const readline = require('readline'); // ファイルを一行ずつ読み込む
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// rsの中から情報を引っ張ってきて出力する
const prefectureDataMap = new Map(); 
// key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns = lineString.split(','); // ','を目安として、配列内容を分割
    const year = parseInt(columns[0]); // 文字列を整数化
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) { 
            // 初期は値がないのでFalsy判定＝下記関数が実行されて値が代入される。
            value = {
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
    //  closeは行すべて読み込み終わってから呼び出される
    for (let [key, value] of prefectureDataMap) {
        // for-of構文。of配列の値の中から、keyにvalueを代入。
        value.change = value.popu15 / value.popu10;
        // 10>>15の変化率を計算
    }
    //// 並び替え ////
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        // Array.fromで連想配列のMapを通常の配列に変換。
        // sortは2つの引数を受け取って並び替えする関数。
        return pair1[1].change - pair2[1].change;
    });

    //// 文字列を綺麗にする ////
    const rankingStrings = rankingArray.map(([key,value], i ) => {
        // .mapはmap関数(連想配列ではない）。
        // Array の要素それぞれを、与えられた関数を適用した内容に変換する関数
        return (i +1) + '位 ' + key + ':' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
        });
    console.log(rankingStrings)
});