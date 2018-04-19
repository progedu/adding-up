'use strict';

const fs = require('fs');                           //fs : FileSystemの略, ファイルを扱うためのモジュール
const readline = require('readline');               //readline : ファイルを一行ずつ読み込むためのモジュール
const rs = fs.ReadStream('./popu-pref.csv');                        //popu-pref.csvファイルからファイル読み込みを行うStreamを生成
const rl = readline.createInterface({'input': rs, 'output':{} });   //rsをreadlineオブジェクトのinputとして設定し，rlオブジェクトを作成
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', (lineString) => {                     
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);              //parseInt : 文字列を整数値に変換する関数
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
rl.resume();                                        //ストリームに情報を流し始める
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {       //Array.from(map):連想配列を普通の配列へ
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair) => {                 //Map の キーと値が要素になった配列を要素 pair として受け取り、それを文字列に変換する
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
