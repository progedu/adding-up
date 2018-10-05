'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv')
const rl = readline.createInterface({'input': rs, 'output': {} });

//
// このコードは、rl オブジェクトで line というイベントが発生したらこの無名関数を呼んでください、という意味です。
// 無名関数の処理の中で console.log を使っているので、line イベントが発生したタイミングで、
// コンソールに引数 lineString の内容が出力されることになります。この lineString には、読み込んだ 1 行の文字列が入っています。
//
// なお、Readline には line 以外のイベントも存在します。
// どのようなイベントがあるのかは、Node.js の API ドキュメント に記載されています。
//
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (l) => {
    const columns = l.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if ( year == 2010 || year == 2015 ) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                p10: 0,
                p15: 0,
                change: null
            };
        }
        if ( year == 2010 ){
            value.p10 += popu
        }
        if ( year == 2015 ){
            value.p15 += popu
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for ( let [k, v] of prefectureDataMap ) {
        v.change = v.p15 / v.p10;
    }
    const ranking = Array.from(prefectureDataMap).sort((p1, p2) => {
        return p1[1].change - p2[1].change
    });
    const results = ranking.map(([key, value], i) => {
        return i +  ': ' + key + ': ' + value.change;
    });
    console.log(results);
});

//
// 最後の resume メソッドの呼び出しは、ストリームに情報を流し始める処理です。
//  https://www.nnn.ed.nico/questions/1489
//
//  readline モジュールの仕様で、resumeをコメントアウトしてもストリームに情報が流れる。
//
//  const rl = readline.createInterface({ 'input': rs, 'output': {} });
//
//  の部分で input ストリームを与えて rl オブジェクトを作った時点で、
//  読み込みが開始されるといえます。
//
rl.resume();

