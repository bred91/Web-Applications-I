"use strict";

const dayjs = require("dayjs");

let now = dayjs().format();
console.log(now);

// constructor function
function Answer(text, respondent, score, date) {
    this.text = text;
    this.respondent = respondent;
    this.score = score;
    this.date = date;

    this.str = function () { return `${this.text} (by ${this.respondent}) on ${this.date.format('YYYY-MM-DD')}, score: ${this.score}`; };
}

function Question(text, questioner, date){
    this.text = text;
    this.questioner = questioner;
    this.date = date;

    this.answers = [];

    this.add = (answer) =>{
        this.answers.push(answer);
    }

    this.findAll = (aut_name) => {
        return this.answers.filter((answer) => answer.respondent === aut_name);
    }

    this.afterDate = (date) => {
        return this.answers.filter((answer) => answer.date.isAfter(date));
    }

    this.listByScore = () => {
        const newList = [...this.answers];
        return newList.sort((a, b) => b.score - a.score);
    }

    this.listByDate = () => {
        // a.date.isAfter(b.date) is not anti-symmetric
        return [...this.answers].sort((a, b) => a.date.diff(b.date));  // (a-b)
    }

    this.avgScore = () => {
        return this.answers.map( (e) => e.score ).reduce( (acc, val, i, arr) => acc+ val/arr.length, 0);
    }
}

const q = new Question('Best way of enumerating an array in JS', 'Enrico', dayjs('2023-02-28'));

const ans1 = new Answer('for of', 'Alice', 3, dayjs('2023-03-07'));
const ans2 = new Answer('for i=0,i<N,i++', 'Harry', 1, dayjs('2023-03-04'));
const ans3 = new Answer('for in', 'Harry', -2, dayjs('2023-03-02'));
const ans4 = new Answer('i=0 while(i<N)', 'Carol', -1, dayjs('2023-03-01'));

q.add(ans1);
q.add(ans2);
q.add(ans3);
q.add(ans4);

console.log(ans1.str());

console.log("-------");
q.findAll('Harry').forEach( (e) => console.log(e.str()) );
console.log("-------");
q.listByScore().forEach( (e) => console.log(e.str()) );
console.log("-------");
q.afterDate(dayjs('2023-03-03')).forEach( (e) => console.log(e.str()) );
console.log("-------");
q.listByDate().forEach( (e) => console.log(e.str()) );
console.log(q.avgScore());