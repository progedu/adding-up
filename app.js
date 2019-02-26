'use strict';
const fs = require('fs');                   // モジュールの呼び出し
const readline = require('readline');       // モジュールの呼び出し
// ファイルを読み込み、rl オブジェクトを作る
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// 集計されたデータを格納する連想配列
const map = new Map();     // key(添字):都道府県 value(値):集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns = lineString.split(',');     // 文字列をカンマで分割して、columnsという配列にする

    // columns の要素へ並び順の番号でアクセスして、
    // 集計年、都道府県、15~19歳の人口をそれぞれ変数に保存する
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);

    if (year === 2010 || year === 2015){
        // 連想配列 map からデータを取得
        let value = map.get(prefecture);
        if(!value){
            value = {
                popu10: 0,        // 2010年の人口
                popu15: 0,        // 2015年の人口
                change: null      // 人口の変化率
            };
        }
        if(year === 2010){
            value.popu10 += popu;
        }
        if(year === 2015){
            value.popu15 += popu;
        }
        map.set(prefecture, value);
    }
});
rl.resume();
rl.on('close', () => {
    for(let pair of map){
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    }
    // 無名関数の中身を並び替える
    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    // map関数(配列の要素それぞれを、与えられた関数を適用した内容に変換する)
    const rankingStrings = rankingArray.map((pair) => {
        // map のキーと値が要素になった配列を要素 pair として受け取り、それを文字列に変換する
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});