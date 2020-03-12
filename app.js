'use strict';
//module呼び出し
const fs = require("fs");
const readline = require('readline');

//Streamオブジェクト生成(イベント駆動型プログラミング)
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output':{}});
const prePopuMap = new Map();//key:prefecture, value:population

//ファイル読み込み
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year =  parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if(year === 2010 || year === 2015){
    let value = prePopuMap.get(prefecture);
    if (!value){
      value={
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
    prePopuMap.set(prefecture, value);
  }
});

//変化率計算，ソート，結果出力
rl.on('close', () =>{
  for(let[key, value] of prePopuMap){
    value.change = value.popu15/ value.popu10;
  }
  const rankingArray = Array.from(prePopuMap).sort((pair1, pair2)=>{
    return -(pair2[1].change - pair1[1].change);
  });
  const rankingStrings = rankingArray.map(([key,value],i) => {
    //return key + ': ' + value.popu10 + ' => ' + value.popu15 + '変化率: ' + value.change;
    return (i+1)+ '位 ' + key + ': ' + value.popu10 + ' => ' + value.popu15 + ' 変化率: '+ value.change;
  });
  console.log("2010年→2015年；都道府県別人口減少率ランキング")
  console.log(rankingStrings);
});

