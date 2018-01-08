'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output':{} });
const map = new Map(); 

rl.on('line', (lineString) =>{
    //console.log(lineString);
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = (columns[2]);
    const popu = parseInt(columns[7]);
    if (year === 2010 || year === 2015){
        //console.log(year);
        //console.log(prefecture);
        //console.log(popu);
        let value = map.get(prefecture);
        if (!value) {
            value = {
                "popu10": 0,
                "popu15": 0,
                "change": null
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
rl.on('close', () => {
    //console.log(map);
    for (let pair of map){
        //map:各県の都道府県の2010年、2015年の人口データ集合
        //pair:各県の都道府県の2010年、2015年の人口データの１要素（47都道府県のうちの1つのデータ）
        //pair[0]:都道府県名
        //pair[1]:2010年、2015年の人口データ
        const value = pair[1];
        value.change = value.popu15 / value.popu10;
    
    }
    const rankingArray = Array.from(map).sort((pair1, pair2)=>{
        //pair2の方が大きい場合は、pair2の方が前の順番にならなければならないので、
        //return で正の数を返すことで、pair2をpair1の前の順番に入れ替えなおす。
        //pair1の方が大きい場合は、pair1の方が前の順番にならなければならないので、
        //return で負の数を返すことで、pair1とpair2の順番をそのままにする。
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map((pair, i)=>{
        //rannkingArrayの1つ1つの要素を、下記のフォーマットにした配列を返す。
　          //「$"都道府県名"：$"「2010年の15歳から19歳の人口」の集計した値"=>$"「2015年の15歳から19歳の人口」の集計した値"変化率:$"変化率"」
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});

rl.resume();