'use strict';
const fs = require('fs');   //ファイルを扱うためのモジュールを呼び出し
const readline = require('readline');   //ファイルを一行ずつ読み込むためのモジュールを呼び出し
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input' : rs, 'output' : {} });

//集計データ格納用　連想配列を作成
const prefectureDataMap = new Map();    //key:都道府県, value:集計データのオブジェクト


//rlオブジェクトでlineというイベントが発生したら無名関数を呼ぶ
rl.on('line', (lineString) => {
    const columns = lineString.split(',');  //文字列の分割
    const year = parseInt(columns[0]);  //年
    const prefecture = columns[1];  //都道府県名
    const popu = parseInt(columns[3]);  //15-19歳の人口
    
    //2010年, 2015年のデータに対してのみ実行
    if(year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture); //prefectureDataMapからkey(都道府県)=prefectureのvalueを取得
        
        //対応するkeyが無い時、valueの初期化
        if(!value){
            value = {
                popu10: 0,  //2010年の15-19歳の人口
                popu15: 0,  //2015年の15-19歳の人口
                change: null
            };
        }

        //取得したデータの代入
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }

        //連想配列に保存
        prefectureDataMap.set(prefecture, value);
    }
});


//rlオブジェクトでcloseというイベントが発生したら無名関数を呼ぶ
rl.on('close', () => {
    //変化率の計算
    for(let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }

    //データの並び替え
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });

    const rankingStrings = rankingArray.map(([key, value], i) => {
        return (i+1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率：' + value.change;
    });

    //データの表示
    console.log(rankingStrings);
});