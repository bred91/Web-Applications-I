"use strict";

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("exams.sqlite", (err) => { if(err) throw err; });

// Simple callback version
let result = [];
let sql = "SELECT * FROM course LEFT JOIN score ON course.code = score.coursecode";

db.all(sql, (err, rows) => {
    if (err) throw err;
    for (let row of rows){
        //console.log(row);
        //console.log(row.code, row.name, row.score);               // it prints after **END of list**
        result.push(row);                                           // it is a closure on the result array   <-------------------
    }
});

console.log('************');
for (let row of result){
    console.log(row.code, row.name, row.score);                     // this doesn't work because it is executed 
}                                                                   // before the db.all() callback
console.log('**END of list**');


// Promise version
