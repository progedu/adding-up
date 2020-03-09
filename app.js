'use strict';
// モジュール呼び出し
const fs = require('fs');
const readline = require('readline');

// Node.js の Stream ストリームを生成
// 順番にちょっとずつ取得する
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

// ストリームから1行づつ読み込み格納
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
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
  // console.log(prefectureDataMap);
});

rl.on('close', () => {
  // 変化率計算
  for (let [key, value] of prefectureDataMap) { 
    value.change = value.popu15 / value.popu10;
  }
  // 変化率順にソート
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  // console.log(rankingArray);
  // 表示用に成形
  const rankingStrings = rankingArray.map(([key, value]) => {
    return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});
