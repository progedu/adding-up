'use strict';

// ファイルを扱うためのモジュール
const fs = require('fs');
// ファイルを1行ずつ読み込むためのモジュール
const readline = require('readline');
// ファイル読み込みを行う Stream を生成する
const rs = fs.ReadStream('./popu-pref.csv');
// rl オブジェクトを作成する
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map();

// line イベントが発生したら、読み込んだ1行の文字列が出力される
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const pref = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    let value = map.get(pref);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }

    if (year === 2010) {
      value.popu10 += popu;
    }
    if (year === 2015) {
      value.popu15 += popu;
    }
    map.set(pref, value);
  }
});

// ストリームに情報を流し始める
rl.resume();

// すべての行が読み込み終わったときに呼び出される
rl.on('close', () => {
  for (let pair of map) {
    const value = pair[1];
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map((pair) => {
    return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
  });
  console.log(rankingStrings);
});
