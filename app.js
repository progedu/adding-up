'use strict';

const fs = require('fs'); // ファイルシステムモジュールのロード
const readline = require('readline'); // リードライン(1行ずつ読み込む)モジュールのロード
const rs = fs.createReadStream('./popu-pref.csv'); // .csvをストリーム処理で読み込み、定数rsに渡す
const rl = readline.createInterface({input: rs, output: {} }); // createInterfaceメソッドに引数rsを渡して、処理結果をrlに渡す
const preDataMap = new Map(); // key: pre ,value: val
//lineイベントが発生した時点で、lsをコンソール出力させる
rl.on('line', ls => {
  const c = ls.split(',');
  const y = parseInt(c[0]);
  const pre = c[1];
  const pop = parseInt(c[3]);
  if(y === 2010 || y === 2015){
    let val = preDataMap.get(pre);
    if(!val){
      val = {
        pop10: 0,
        pop15: 0,
        change: null
      };
    }
    if(y === 2010){
      val.pop10 = pop;
    }
    if(y === 2015){
      val.pop15 = pop;
    }
    preDataMap.set(pre, val);
  }
});
rl.on('close', ()=>{
  for(let [key, val] of preDataMap){
    val.change = val.pop15 / val.pop10;
  }
  const r = Array.from(preDataMap).sort((pair1, pair2)=>{
    return pair1[1].change - pair2[1].change;
  });
  const rStr = r.map(([key, val], i) => {
    return ((i + 1) + '位' + key + ': ' + val.pop10 + '=>' + val.pop15 + ' 変化率:' + val.change);
  });
  console.log(rStr);
});