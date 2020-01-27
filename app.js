'use strict';

//Node.jsオブジェクト
const fs = require('fs');
const readline = require('readline');

//Stremを使用するためにInterfaceも実装
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map();

//Streamでlineイベントが発生するたびに処理を実施
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

  });

  //Streamで読み取りが終了時変化率を計算してchangeにセット
  rl.on('close', () => 
  {

    //変化率を設定
    for(let[key,value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }

    //連想配列を配列に変換後、変化率の数値順で並び替え
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
    });

    //配列を整形
    const rankingStrings = rankingArray.map(([key, value],i) => {
        return (i+1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
      
    console.log(rankingStrings);

});