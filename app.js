'use strict';
const fs = require('fs');
//一行読み込むモジュール
const readline = require('readline');
//fsモジュールでStreamでファイルを読み込む
const rs = fs.ReadStream('./popu-pref.csv')
//一行ごとにStreamで読み込み、inputとしてオブジェクトを生成
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//都道府県のデータ集計値
const map = new Map();

//r1オブジェクトが実行された時の処理
rl.on(
    //lineイベント(一行読込)が実行されたら、lineStringを引数として引き渡し関数を実行
    'line',(lineString) =>{
        //読み込んだ一行を','区切りで項目に分割して配列化
        const colums = lineString.split(',');
        const year = parseInt(colums[0]);
        const prefecture = colums[2];
        const popu = parseInt(colums[7]);

        //2010 または 2015の時のみ実行
        if (year === 2010 || year === 2015){
            //都道府県をkeyとして配列から値を得る値としてValueを定義
            let value = map.get(prefecture);
            //値が定義されてなかったら
            if (!value){
                //valueにオブジェクトを生成
                value = {
                    popu10:0,
                    popu15:0,
                    change:null
                };
            }
            if (year === 2010){
                value.popu10 += popu;
            }
            if (year === 2015){
                value.popu15 += popu;
            }
            //Valueに組み込んだ値をMap配列に都道府県をkeyとして格納(都道府県をkeyとして値が追加されていく)
            map.set(prefecture,value);
        }
    }
);
//Streamの情報の流し込み開始
rl.resume();
//closeイベント時の処理
rl.on('close',() => {
    //mapオブジェクトに格納されたValueを順に呼び出し、changeプロパティに変化率を代入していく
    for (let pair of map){
        //読み込んだ要素のmapのValueオブジェクト(pair1[1])を定数valueに代入(*オブジェクトそのものが代入されている事に注意)
        const value = pair[1];
        //定数Value(実体はオブジェクト)のchangeプロパティ値に変化率を代入>map内のオブジェクトが書き換えられた
        value.change =value.popu15 - value.popu10;
    }
    //mapの配列を2つずつ取り出してpair1,pair2に代入して比較、ソートしていく
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    //map関数で並び替えして整形
    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair [1].popu10 + '=>' + pair[1].popu15 + ' 変化率:'+pair[1].change;
    })
    console.log(rankingStrings);
});