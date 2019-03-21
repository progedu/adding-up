'use strict';

// ファイルからデータを読み取る
// 2010 年と 2015 年のデータを選ぶ
// 都道府県ごとの変化率を計算する
// 変化率ごとに並べる
// 並べられたものを表示する

const fs = require('fs'); // Node.jsに用意されたモジュールを呼び出している。 ファイルシステムを扱うためのモジュールを呼び出している
const readline = require('readline'); // ファイルを一行ずつ読み込むためのモジュール
const rs = fs.ReadStream('./popu-pref.csv'); // CSVを読み込むStreamを作る
const rl = readline.createInterface({ 'input': rs, 'output': {} }); // readlineオブジェクトのinputとして設定し、rl オブジェクトを作っている
const prefctureDataMap = new Map(); // key 都道府県名 value 集計データのオブジェクト

rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefcture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    let value = prefctureDataMap.get(prefcture); // prefectureDataMap からデータを取得している
    if (!value) { 
      // value の値が falsy の場合に、value に初期値となるオブジェクトを代入する。その県のデータを処理するのがはじめてであれば、valueの値はundefinedになるため、この条件を満たし、valueに値が代入される
      value = {
        popu10: 0,
        popu15: 0,
        change: null,
      };
    }
    if (year === 2010) {
        value.popu10 = popu + value.popu10;
    }
    if (year === 2015) {
        value.popu15 = popu + value.popu15;
    }
    prefctureDataMap.set(prefcture, value);
}
});
rl.on('close', () => {
  for (let [key, value] of prefctureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefctureDataMap).sort((pair1, pair2) => {
    return  pair1[1].change - pair2[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value], i) => {
    return (i +1) + '位:' + key + ': ' + value.popu10 + '人 =>' + value.popu15 + '人' + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});


