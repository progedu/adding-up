"use strict";

{
  //   const fs = require("fs");
  //   const readline = require("readline");
  //   const rs = fs.createReadStream("popu-ref.csv");
  //   const rl = readline.createInterface({ " input ": rs, " output ": {} });

  //   rl.on("line", (lineString) => {
  //     console.log(lineString);
  //   });

  const fs = require("fs");
  const readline = require("readline");
  const rs = fs.createReadStream("./popu-pref.csv");
  const rl = readline.createInterface({ input: rs, output: {} });
  const prefectureDataMap = new Map();

  rl.on("line", (lineString) => {
    const arr = lineString.split(",");
    const year = parseInt(arr[0]);
    const prefecture = arr[2];
    if (arr[0] !== "集計年") {
      let value = prefectureDataMap.get(prefecture);
      if (!value) {
        value = {
          p2010: 0,
          p2015: 0,
          rate: null
        };
      }
      if (year === 2010 && arr[3] === "男") {
        for (let i = 4; i < arr.length; i++) {
          value.p2010 += parseInt(arr[i]);
        }
      }
      if (year === 2015 && arr[3] === "男") {
        for (let i = 4; i < arr.length; i++) {
          value.p2015 += parseInt(arr[i]);
        }
      }
      prefectureDataMap.set(prefecture, value);
    }
  });

  rl.on("close", () => {
    for (let [key, value] of prefectureDataMap) {
      value.rate = value.p2015 / value.p2010;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((a, b) => {
      return b[1].rate - a[1].rate;
    });

    const rankingStrings = rankingArray.map(([key, value]) => {
      return (
        key + ": " + value.p2010 + "=>" + value.p2015 + " 変化率:" + value.rate
      );
    });

    console.log(rankingStrings);
  });
}
