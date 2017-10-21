'use strict';

// ファイルを扱うためのモジュール
const fs = require('fs');
// ファイルを1行ずつ読み込むためのモジュール
const readline = require('readline');
// ファイル読み込みを行う Stream を生成する
const rs = fs.ReadStream('./popu-pref.csv');
// rl オブジェクトを作成する
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// line イベントが発生したら、読み込んだ1行の文字列が出力される
rl.on('line', (lineString) => {
  console.log(lineString);
});
// ストリームに情報を流し始める
rl.resume();
