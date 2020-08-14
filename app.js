'use strict';
const fs = require('fs'); //FileSystem Moduleの呼び出し(Node.js)　
const readline = require('readline'); //ファイルを一行ずつ読み込むModule
const rs = fs.createReadStream('./popu-pref.csv'); //popu-pref.csvを読み込むStreamを作成
const rl = readline.createInterface({ 'input': rs, 'output': {} }); //Readlineのinputを上記のrsに設定したrlと言うオブジェクト
//Stream...「情報の流れ」の事、この中で起きた事柄に関してアクションを設定する
//rlはStreamのInterfaceを持つ、それを利用するのが以下のコードとなる
const prefectureDataMap = new Map(); //key: 都道府県 value:集計データのオブジェクト
/** 
 * rlオブジェクトの内部で'line'イベントが発生した場合アロー関数で
 * 内部の処理を実行
 * line処理は要するにreadlineで一行ずつ読んだもの　一行読むと呼び出し
 */
rl.on('line', (lineString) => {
    const columns = lineString.split(','); //,で分割 pythonでもこれやるよね
    const year = parseInt(columns[0]); //年をInt型で取得
    const prefecture = columns[1]; //県をString型で取得
    const popu = parseInt(columns[3]); //人口をInt型で取得
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture); //県をvalueとして取得
        if (!value) { //let valueで値が存在しない場合initialize
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
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) { //for-of構文
        value.change = value.popu15 / value.popu10;
    }
    /**
     * Mapをarrayに変換し、sortに渡して、アロー関数で渡す
     * 様々が難しい……
     */
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) =>{
        return pair2[1].change - pair1[1].change
    });
    /**
     * 整形する
     * ここで出るmap関数はMapとは別物で「Array内部の要素それぞれに与えられた関数を適用した内容に変換」と言うもの
     */
    const rankingStrings = rankingArray.map(([key,value],i) => {
        return (i+1) + "位 " + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
});