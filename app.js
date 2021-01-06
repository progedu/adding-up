'use strict';

// csvを読み込む
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input':rs, 'output':{} });

// 集計されたデータを格納する連想配列
// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

rl.on('line', (lineString) => {
    // 1行分のデータを配列にする
    const columns = lineString.split(',');
    // 集計年を取得する
    const year = parseInt(columns[0]);
    // 都道府県を取得する
    const prefecture = columns[1];
    // 15~19歳の人口を取得する
    const popu = parseInt(columns[3]);

    // タイトル部分の場合表示しない
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        // 値が格納されていない場合
        if(!value){
            // 連想配列に初期値となる値を格納する
            value = {
                popu10:0,
                popu15:0,
                change:null
            }
        }
        // 2010年の場合、popu10に値を格納する
        if(year === 2010){
            value.popu10 = popu;
        }
        // 2015年の場合、popu15に値を格納する
        if(year === 2015){
            value.popu15 = popu;
        }
        // 都道府県をキー,value変数を値をして連想配列を格納する
        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () =>{
    // 都道府県ごとに、変化率を計算し格納する
    for(let [key, value] of prefectureDataMap){
        value.change = value.popu15/value.popu10;
    }
    // 変化率ごとに入れ替えランキングを作成する
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    // 整形して出力する
    const rankingStrings = rankingArray.map(([key, value]) =>{
        return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change; 
    });
    // console.log(rankingStrings);
    for(let i = 0; i<rankingStrings.length; i++){
        console.log(i+1 + '位 ' + rankingStrings[i]);
    }
});