'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({
  'input': rs, 
  'output': {}
});
const map = new Map();

rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year == 2010 || year == 2015) {
    let value = map.get(prefecture);
    if (!value) {
      value = {
        popu10: 0, 
        popu15: 0, 
        change: null
      };
    }
    if (year == 2010){
      value.popu10 += popu;
    }
    if (year == 2015){
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
  const rankingStrings = rankingArray.map((pair, i) => {
    return (i + 1) + '. ' + pair[0] + ': ' + pair[1].popu10 + ' => ' + pair[1].popu15 + ' 変化率: ' + Math.round10(pair[1].change, -3);
  })
  console.log(rankingStrings);
});

  /**
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
   * Decimal adjustment of a number.
   * 
   * * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }