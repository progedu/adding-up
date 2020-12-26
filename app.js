'use strict';
//File System モジュールと Readlineモジュールを呼び出し
const fs = require('fs');
const readline = require('readline');
//変数rsに人口のCSVファイルをセット
const rs = fs.createReadStream('./popu-pref.csv');
//変数rlにrsをインプット アウトプットは今回しないため空白
const rl = readline.createInterface({input:rs, output:{}});
//都道府県ごとの集計結果を入力するための配列を作成
const prefectureDataMap = new Map(); //Key:都道府県, Value: 集計データのオブジェクト
//コンソールにcsvの内容 = rlにインプットしたrs = csvの内容を1行ずつ書き出す
rl.on('line',lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        //都道府県ごとのデータを作る
        let value = prefectureDataMap.get(prefecture);
        //データがなかったらデータを初期化
        if (!value){
            value = {popu10: 0, popu15: 0,change: null};
        }
        if (year == 2010){
            value.popu10 = popu;
        }
        if (year == 2015){
            value.popu15 = popu;   
        }
        
        prefectureDataMap.set(prefecture,value);
    }
    //console.log(lineString);
    //console.log(year+"年" + prefecture + " " + popu +"人");
});
rl.on('close',() => {
    //console.log(prefectureDataMap);
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    //人口が減っている順番にランキング付けする
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value],i) => {
        return (
           i+1 + '位: ' + key + ': ' + value.popu10 + ' => ' + value.popu15 + ' 変化率: ' + value.change
        );
    });
    console.log(rankingStrings);
});