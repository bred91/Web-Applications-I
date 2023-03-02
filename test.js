"use strict";

function test() {
  console.log("test");
}

test();

function test2(text) {
    const testo = text;
    const test3 = function(){
        return testo;
    }

    return test3;
}

const test4 = test2("test");

console.log(test4());