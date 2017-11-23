'use strict';
const fs = require('fs');//fs=ファイルシステムを変数定義　node.jsのrequireはライブラリのオブジェクトを読み込む関数
const readline = require('readline');//ファイルを行ごとに読み込むことができる
const rs = fs.ReadStream('./popu-pref.csv');//ストリームでファイルを読み込んでくる
const rl = readline.createInterface({ 'input': rs, 'output': {} });//readlineモジュールで一行ずつ読み込んでくる
const map = new Map(); // key: 都道府県 value: 集計データのオブジェクト　一行ずつよみこ
rl.on('line', (lineString) => { //onというイベントを検知すると、（line=一行読めたら）、(lineString)という引数に一行のデータが入ってくる
                                //　=>アロー関数で無名関数を定義している。
    const columns = lineString.split(',');//カンマで区切って配列に入れる
    const year = parseInt(columns[0]);//columns[0]はcsv区切りの最初のもの年数をさす、parseIntで文字列から数字に
    const prefecture = columns[2];//3番目の都道府県
    const popu = parseInt(columns[7]);//8番目の人口
    if (year === 2010 || year === 2015) { //parseIntで数字化された数値と===厳密にチェック
        let value = map.get(prefecture); //都道府県を読み込む
        if (!value) { //都道府県の値がない場合に初期化
            value = {
                popu10: 0,
                popu15: 0,
                change: null //変化率
            };
        }
        if (year === 2010) { //2010年に一致したら、
            value.popu10 += popu; //人口をpopu10に代入、二回目で男女が合算される
        }
        if (year === 2015) {
            value.popu15 += popu;
        }
        map.set(prefecture, value);//都道府県と人口を連想配列に登録
    }
});
rl.resume(); //ここで処理を実行
rl.on('close', () => { //無名関数
    for (let pair of map) {//for of 構文でループ処理
        const value = pair[1];//mapの中のvalue（集計データのオブジェクト）を読み込む（pair[0]はkeyの都道府県）
        value.change = value.popu15 / value.popu10; //変化率に2015年の人口を2010年の人口で割ったものを代入
        //console.log(pair[1]); //集計データのオブジェクトを確認
    }
    const rankingArray = Array.from(map).sort((pair1, pair2) => {//連想配列から、配列に戻す際に、並び替えを行う
        //return pair2[1].change - pair1[1].change; //並び替えの条件は降順、引き算をして、結果が正であれば、pair2を前に
        return pair1[1].change - pair2[1].change; //並び替えの条件は昇順、引き算をして、結果が正であれば、pair1を前に
    });
    const rankingStrings = rankingArray.map((pair, i) => { //map関数で配列の中身に処理を加える
        //return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
        return (i + 1) + '位 ' + pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});