"use strict";
const dayjs = require("dayjs");

let now = dayjs();

console.log(now.format());
console.log(now.format("YYYY-MM-DD"));

// Professors solution
const myScores = [-12, -3, 18, 10, 4, -1, 0, 14];
// the reference of the array is const, but the values are not
const modifiedScores = [...myScores]; 

modifiedScores.sort((a,b) => (a-b));

let NN = modifiedScores.findIndex( e => e >= 0);

console.log(NN);
modifiedScores.splice(0, NN);
modifiedScores.shift();
modifiedScores.shift();

console.log(modifiedScores);

let avg = 0;
for (const val of modifiedScores)
    avg += val;

avg = avg / modifiedScores.length;

console.log(avg);

const addedArray = Array(10).fill(Math.round(avg));

// it creates a new array
const modifiedScores2 = [...modifiedScores, ...addedArray];

// it modifies the original array
modifiedScores.slice(modifiedScores.length, 0, ...addedArray);

// My solution
console.log("\n My solution \n");
const new_str = myScores.filter((score) => score >= 0).sort((a,b) => (a-b));
console.log(new_str);

const NN2 = new_str.length;
console.log(NN2);

new_str.splice(0, 2);
console.log(new_str);

let avg2 = new_str.reduce((a, b) => a + b, 0) / new_str.length;
console.log(avg2);