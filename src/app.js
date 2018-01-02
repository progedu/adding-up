'use strict'

import fs from 'fs'
import readline from 'readline'
const rs = fs.ReadStream('./popu-pref.csv')
const rl = readline.createInterface(rs)
const map = new Map() // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  const columns = lineString.split(',')
  const year = parseInt(columns[0])
  const [,,prefecture] = columns
  const popu = parseInt(columns[7])
  if(year == 2010 || year == 2015) {
    let value = map.get(prefecture)
    if(!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      }
    }
    if(year === 2010) {
      value.popu10 += popu
    }
    if(year === 2015) {
      value.popu15 += popu
    }
    map.set(prefecture, value)
  }
})
rl.resume()
rl.on('close', () => {
  for(const value of map.values()) {
    value.change = value.popu15 / value.popu10
  }
  const rankingArray = Array.from(map).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change
  })
  const rankingStrings = rankingArray.map((pair, i) => {
    return `第${i+1}位 ${pair[0]}: ${pair[1].popu10}=>${pair[1].popu15} 変化率: ${pair[1].change}`
  })
  console.log(rankingStrings)
})
