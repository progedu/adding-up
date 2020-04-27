'use strict';
const fs = require('fs');   //ファイルを扱うためのモジュールを呼び出し
const readline = require('readline');   //ファイルを一行ずつ読み込むためのモジュールを呼び出し
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input' : rs, 'output' : {} });

//rlオブジェクトでlineというイベントが発生したら無名関数を呼ぶ
rl.on('line', (lineString) => {
    const columns = lineString.split(',');  //文字列の分割
    const year = parseInt(columns[0]);  //年
    const prefecture = columns[1];  //都道府県名
    const popu = parseInt(columns[3]);  //15-19際の人口
    
    //2010年, 2015年のデータのみ表示
    if(year === 2010 || year === 2015){
        console.log(year);
        console.log(prefecture);
        console.log(popu);
    }
});
