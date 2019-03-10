'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('popu-pref.csv');
const rl = readline.createInterface( {
  input: rs,
  output: {}
});
const prefData = new Map();

rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  
  if (year === 2010 || year === 2015) {
    let value = prefData.get(prefecture);

    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      }
    }

    if (year === 2010) {
      value.popu10 += popu;
    }
    if (year === 2015) {
      value.popu15 += popu;
    }
  
    prefData.set(prefecture,value);
  }
  
});

rl.on('close', () => {
  const prefDataArray = Array.from(prefData);
  prefDataArray.map( ([key, value]) => {
    value.change = value.popu15 / value.popu10;
  });
  prefDataArray.sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change;
  });
  prefDataArray.map( ([key, value], i) => {
    console.log(`${i+1}: ${key} => change ratio: ${value.change}`);
  });
});