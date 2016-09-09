'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// lineイベントの処理
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015) {
        let value = map.get(prefecture);    // valueに県名をセット
        if (!value) { // True
            value = { // valueオブジェクトの定義
                p10: 0,
                p15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.p10 += popu;
        }
        if (year === 2015) {
            value.p15 += popu;
        }
        map.set(prefecture, value); // map配列の県名に県名をセット
    }
});

// ストリームを流す
rl.resume();

// closeイベントの処理
rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1];
        value.change = value.p15 / value.p10; // 変化率
    }      

    const rankingArray = Array.from(map).sort((p1, p2) => { // map配列をソートし、ランキング配列にセット
        return p2[1].change - p1[1].change; 
    });

    const rankingStrings = rankingArray.map((p) => { // ランキング配列をランキングストリング配列にセット　p: 要素
        return p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change; // 整形
    });    
    
    console.log(rankingArray); // ランキング配列を出力
});

