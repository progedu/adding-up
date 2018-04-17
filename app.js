'use strict';

// Node.jsのモジュール[fs]を呼び出す
// fs:[FileSystem]の略でファイルを扱う
const fs = require('fs');
// readline:ファイルを一行ずつ読み込む
const readline = require('readline');

// ファイルから読み込みを行う[Stream]を生成
// stream:非同期時の情報の流れ
const rs = fs.ReadStream('./popu-pref.csv');
// readlineオブジェクトをinputに設定しrlオブジェクトを作成
const rl = readline.createInterface({ 'input': rs, 'output': {} });
// key: 都道府県 value: 集計データのオブジェクト
const map = new Map();
// rlオブジェクトを利用するさいのコード(15-20)
// rlオブジェクトでlineイベントが発生したら無名関数を呼ぶ意
rl.on('line', (lineString) => {
	// console.log(lineString); ファイル呼び出しテスト用処理

	// 引数lineStringで与えられた文字列を[,]で分割し配列columnsへ
	const columns = lineString.split(',');

	// columnsへcsvの並び順でアクセス。
	// 上から集計年[0]、都道府県[2]、歳の人口[7]を変数に保存
	// perseInt:文字列を整数値に変換する関数
	const year = parseInt(columns[0]);
	const prefecture = columns[2];
	const popu = parseInt(columns[7]);

	// 集計年の判定。該当年のみ表示。
	if (year === 2010 || year === 2015) {
		//console.log(year);
		// console.log(prefecture);
		// console.log(popu);
		let value = map.get(prefecture);
		if (!value) {
			value = {
				popu10: 0,
				popu15: 0,
				change: null
			};
		}
		if (year === 2010) {
			value.popu10 += popu;
		}
		if (year === 2015) {
			value.popu15 += popu;
		}
		map.set(prefecture, value);
	}
});
rl.resume();
rl.on('close', () => {
	for (let pair of map) {
			const value = pair[1];
			value.change = value.popu15 / value.popu10;
	}
	const rankingArray = Array.from(map).sort((pair1, pair2) => {
			return pair2[1].change - pair1[1].change;
	});
	const rankingStrings = rankingArray.map((pair) => {
			return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
	});
	console.log(rankingStrings);
});
