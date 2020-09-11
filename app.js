'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
rl.on('line', lineString => {
	const cols = lineString.split(',');
	const year = parseInt(cols[0]);
	const prefecture = cols[1];
	const popu = parseInt(cols[3]);
	if(year === 2010 || year === 2015){
		console.log(year);
		console.log(prefecture);
		console.log(popu);
	}
});

