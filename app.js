'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map();

rl.on('line', (lineString) => {
	const columns = lineString.split(',');
	const year = parseInt(columns[0]);
	const prefecture = columns[2];
	const popu = parseInt(columns[7]);

	if (year === 2010 || year === 2015) {
		// Mapオブジェクトのキーを取得
		let value = prefectureDataMap.get(prefecture);
		// 取得するキーがないとき初期化
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
		// Mapオブジェクトにkeyとvalue追加
		prefectureDataMap.set(prefecture, value);
	}
});
// closeはすべての処理が終わったら読み込むイベント
rl.on('close', () => {
	// prefectureDataMap（key:都道府県、value:集計データのオブジェクト）
	for (let [key, value] of prefectureDataMap) {
		value.change = value.popu15 / value.popu10;
	}
	// 連想配列を普通の配列に変換する
	// sort関数で並び替えをする
	const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
		// sortで比較するときの決まった書き方
		return pair2[1].change - pair1[1].change;
	});
	// rankingArray（key:都道府県、value:集計データのオブジェクト）
	const rankingStrings = rankingArray.map(([key, value]) => {
		return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
	});
	console.log(rankingStrings);
});