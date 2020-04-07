'use strict';
//Node.jsに用意されたモジュールを呼び出しています
const fs = require('fs');//FileSystem ファイルを扱うためのモジュール
const readline = require('readline');//ファイルを一行ずつ読み込むためのモジュールです。
//ファイルの読み込みを行うStreamを生成し、さらにそれを、readlineオブジェクトのinputとして設定し、rlオブジェクトを生成
//Stream(流れ) 非同期で情報を取り扱うための概念で、情報自体ではなく情報の流れに注目します
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs,'output':{}});

const prefectureDataMap = new Map();//key: 都道府県 value: 集計データのオブジェクト

//rlオブジェクトでlineというイベントが発生したら　この無名関数を呼ぶ
rl.on('line',(lineString) => {
    const columns = lineString.split(',');//引数lineStringで与えられた文字列をカンマで分割
    const year = parseInt(columns[0]);//集計年
    const prefecture = columns[1];//都道府県
    const popu = parseInt(columns[3]);//15~19歳の人口
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);//データ取得
        if(!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
//各県各年男女のデータが集計された Map のオブジェクトを出力
rl.on('close', () => {
    for(let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value],i) => {
        return (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});
