'use strict';

const haru = 100;
let value = new Map();
let profile = {
    sex:'man',
    age:32
}
value.set('senaha', profile);
console.log(value.get('senaha'));

// オブジェクトを配列 
console.log(Array.from(value));