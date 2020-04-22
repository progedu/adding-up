'use strict';
const fs = require('fs');
//FileSystemの略。ファイルを扱うためのモジュール
const readline = require('readline');
//ファイルを一行ずつ読み込むためのモジュール
const rs = fs.createReadStream('./popu-pref.csv');
//ファイルから、ファイルを読み込みを行うStreamを生成
const rl = readline.createInterface({'input': rs, 'output': {} });
//readlineオブジェクトのinputとして設定し、rlオブジェクトを作成。
const prefectureDataMap = new Map();
//key：都道府県 value:集計データのオブジェクト。集計されたデータを格納する連想配列。キーと値が何かコードだけからは読み取りにくいのでコメントに書いておく。
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  //lineStringで与えられた文字列をカンマで分割して、それをcolumnsという配列にしている。
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  //配列columnsの要素へ並び順の番号でアクセスして、集計年（0）、都道府県（1）、15〜19再の人口（3）をそれぞれ変数に保存。
  //parseInt()は文字列を整数値に変換する関数。lineString.split()は文字列を対象とした関数なので、結果も文字列に配列になっている。
  if(year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if(!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    //連想配列prefectureDataMapからデータを取得する。valueの値がFalsyの場合に、valueに初期値となるオブジェクトを代入。その県のデータを処理するのが初めてであれば、valueの値はundefinedになるので、この条件を満たし、valueに値が代入される。
    //popu10が2010年の人口、popu15が2015年の人口、changeが人口の変化率を表すプロパティ。変化率には初期値ではnullを代入。
    if(year === 2010) {
      value.popu10 = popu;
    }
    if( year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
  //人口のデータを連想配列に保存。次から同じ県のデータがくれば、let value~のところでは、保存したオブジェクトが取得される。
});
rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
    //集計データのオブジェクトvalueのchangeプロパティに、変化率を代入。
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    //Array.from(prefectureDataMap)で連想配列を普通の配列に変換、sort関数を呼んで無名関数を渡す。sortに対して渡す関数は比較関数といい、これにより、並び替えをするルールを決められる。比較関数は2つの引数をとって、前者の引数1を後者の引数2より前にしたいときは、負の整数、2を1より前にしたいときは正の整数。並びをそのままにしたいときは0を返す。
    //変化率の降順に並び替えをしたいので、2が1より大きかった場合、2を1より前にする必要がある。2が1より大きいときに正の整数を返す処理を書けば良いので。2の変化率のプロパティから1の変化率のプロパティを引き算した値を返す。これにより、変化率の降順に並び替えられる。
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    //連想配列のMapとは別のmap関数。
    return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    //Mapのキーと値が要素になった配列を要素[key, value]として受け取り、それを文字列に変換する。
  });
  console.log(rankingStrings);
});
//closeイベントでは全ての行を読み込み終わった際に呼び出される。その際の処理として各県各年男女のデータが集計されたMapのオブジェクトを出力している。変化率の計算は、その県のデータが揃ったあとでしか正しく行えないので、closeイベントの中へ実装。
//for-of構文。MapやArrayの中身をofの前に与えられた変数に代入してforループと同じことができる。配列に含まれる要素を使いたいだけで、添字は不要な場合に便利。
//また、Mapにfor-ofを使うと、キーと値で要素が2つある配列が前に与えられた変数に代入される。ここでは分割代入している。let [変数名1, 変数名2]のように変数と一緒に配列を宣言することで、第一要素のkeyという変数にキーを、第二要素のvalueという変数に値を代入。
//アロー関数では宣言された式が自動的にreturnされるので、{}キーワードを省略して書くこともできる。




