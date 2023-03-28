"use strict";

// document.getElementsByTagName("table")[0].classList.remove("table");
let p = document.createElement("p");
let d = dayjs().format("YYYY-MM-DD HH:mm:ss");
p.innerText = d;

document.getElementById("time").appendChild(p);

setInterval( 
    () => p.innerText = dayjs().format("YYYY-MM-DD HH:mm:ss"), 
    1000
);

// search the tr inside the table
// return the first one
// let row = document.querySelector('table tr');

// row.addEventListener('click', event => {
//     console.log("clicked!");
// });

// search all the tr inside the table
// return a NodeList (similar to an array)
let rows = document.querySelectorAll('table tr');
for (let row of rows) {
    // row.addEventListener('click', event => {
    //     // target is the element that triggered the event
    //     //console.log(event.target, "clicked!");

    //     // this is an example of closure
    //     // when the event is triggered, the row variable defined before is remembered
    //     //console.log(row.children[3].innerText);

    //     // what is returned by the DOM is always a string !!!
    //     const score = row.children[3].innerText;
    //     const newScore = parseInt(score) + 1;
    //     row.children[3].innerText = newScore;
    // });
    let b = row.querySelector('button');
    if (b){
        b.querySelector('button').addEventListener('click', event => {
            const score = row.children[3].innerText;
            const newScore = parseInt(score) + 1;
            row.children[3].innerText = newScore;
        });
    }    
}