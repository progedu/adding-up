'use strict';
const fs = require('fs'),
      readline = require('readline'),
      rs = fs.createReadStream('./popu-pref.csv'),
      rl = readline.createInterface({ 'input': rs, 'output': {} }),prefectureDataMap = new Map();
rl.on('line', (lineString) => {
  const columns = lineString.split(','),
        year = parseInt(columns[0]),
        prefecture = columns[1],
        middler = parseInt(columns[2]),
        higher = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: [0, 0],
        popu15: [0, 0],
        change: [null, null]
      };
    }
    if (year === 2010) {
      value.popu10[0] = middler;
      value.popu10[1] = higher;
    }
    if (year === 2015) {
      value.popu15[0] = middler;
      value.popu15[1] = higher;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change[0] = value.popu15[0] / value.popu10[0];
    value.change[1] = value.popu15[1] / value.popu10[1];
  }
  const middlerRankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
          return pair2[1].change[0] - pair1[1].change[0];
        }),
        higherRankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
          return pair2[1].change[1] - pair1[1].change[1];
        }),
        middlerRankingStrings = middlerRankingArray.map(([key, value], i) => {
          return (i + 1) + '位 ' + key + ':' + value.popu10[0] + '=>' + value.popu15[0] + ' 増加率:' + value.change[0];
        }),
        higherRankingStrings = higherRankingArray.map(([key, value], i) => {
          return (i + 1) + '位 ' + key + ':' + value.popu10[1] + '=>' + value.popu15[1] + ' 増加率:' + value.change[1];
        });
  console.log('10歳〜14歳の人口増加率ランキング');
  console.log(middlerRankingStrings);
  console.log('15歳〜19歳の人口増加率ランキング');
  console.log(higherRankingStrings);
});