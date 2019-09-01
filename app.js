'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv'); // csvファイルから、ファイルを読み込みを行うストリームを生成
const rl = readline.createInterface({ input: rs, 'output': {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
// 集計されたデータを格納する連想配列⬆︎
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]); // 集計年 文字列から数値に変換
  const prefecture = columns[1]; // 都道府県
  const popu = parseInt(columns[3]); // 人口 文字列から数値に変換
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture); // 連想配列 prefectureDataMap からデータを取得
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) { // 人口のデータを連想配列に保存
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value .popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${key}: ${value.popu10} -> ${value.popu15} 変化率: ${value.change}`;
  })
  console.log(rankingStrings);
});