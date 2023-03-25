"use strict";

/// Promise
const myPromise = new Promise((resolve, reject) => {

    resolve("Promise resolved");

    reject("Promise rejected");

});

myPromise.then((result) => {
    console.log("Success: " + result);
}).catch((error) => {
    console.log("Error: " + error);
});

console.log("2")
//// 
function wait(duration){
    // Create and return a new promise
    return new Promise((resolve, reject) => {
        // If the argument is invalid -> reject the promise
        if(duration < 0){
            reject(new Error("Invalid duration"));
        }
        // Otherwise, wait asynchronously anf then resolve the promise
        // setTimeout will invoke resolve() with no arguments:
        // the Promise will be resolved with the undefined value+
        else {
            setTimeout(resolve, duration);
        }
    });
}

wait(-2000).then(() => {
    console.log("2 seconds have passed");
}).catch((error) => {
    console.log("ERROR: "+error.message);
});




console.log("3")
// 3
const sample = async () => {
    return 'Hello World';
}

sample().then(console.log);


