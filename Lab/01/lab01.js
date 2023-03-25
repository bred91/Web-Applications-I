"use strict";

const dayjs = require('dayjs');

// 0. Preparation and warm-up exercise
console.log("0. Preparation and warm-up exercise");
let array = ["alpha", "beta", "a", "gamma","it","cat"]

function printer(array){
    for (let el of array){
        if(el.length < 2) {
            console.log("");
        }
        else if (el.length == 2){
            console.log(el+el);
        }
        else if (el.length == 3){
            console.log(el[0]+el[1]+el[1]+el[2]);
        }
        else{
            let _lenght = el.length;
            console.log(el[0]+el[1]+el[_lenght - 2]+el[_lenght - 1]);
        }
    }    
}

printer(array);
console.log("***************************************\n");

// 1. Create a Film Library
console.log("1. Create a Film Library");
function Film(_id, _title, _favorites = false, _watched_date = '<not defined>', _rating = '<not defined>') {
    this.id = _id;
    this.title = _title;
    this.favorites = _favorites;
    this.rating = _rating;
    this.watched_date = _watched_date;

    this.stampa = function() { 
        if (this.watched_date === '<not defined>')
            return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorites}, Watch date: <not defined>, Score: ${this.rating}`
        else
            return `Id: ${this.id}, Title: ${this.title}, Favorite: ${this.favorites}, Watch date: ${this.watched_date.format('MMMM DD,YYYY')}, Score: ${this.rating}` 
    }
}

function FilmLibrary(){
    this.films = [];

    this.addNewFilm = (film) =>{
        this.films.push(film);
    }

    this.printer = function () {
        for (let f of this.films)
            console.log(f.stampa())
    }

    this.sortByDate = () => {
        return [...this.films].sort((a, b) => {
            
            if (a.watched_date === '<not defined>') 
                return 1;
            else if (b.watched_date === '<not defined>')
                return -1;
            else
                return a.watched_date.diff(b.watched_date)
        });
    }

    this.deleteFilm = (id) => {
        this.films = this.films.filter((e) => e.id !== id);
    }

    this.resetLibrary = () => {
        this.films = [];
    }

    this.getRated = () => {
        return this.films.filter((e) => e.rating !== '<not defined>').sort((a, b) => a.rating - b.rating);
    }
}

const filmLibrary = new FilmLibrary();

const film1 = new Film(1, "Pulp Fiction", true, dayjs("2023-03-10"), 5);
const film2 = new Film(2, "21 Grams", true, dayjs("2023-03-17"), 4);
const film3 = new Film(3, "Star Wars", false);
const film4 = new Film(4, "Matrix", false);
const film5 = new Film(5, "Shrek", false, dayjs("2023-03-21"), 3);

filmLibrary.addNewFilm(film1);
filmLibrary.addNewFilm(film2);
filmLibrary.addNewFilm(film3);
filmLibrary.addNewFilm(film4);
filmLibrary.addNewFilm(film5);

filmLibrary.printer();
console.log("***************************************\n");

// 2. Add functionalities to the Film Library
console.log("2. Add functionalities to the Film Library");
console.log("sort by date");
filmLibrary.sortByDate().forEach( (e) => console.log(e.stampa()) );

console.log("delete film 3");
filmLibrary.deleteFilm(3);
filmLibrary.printer();

console.log("get rated");
filmLibrary.getRated().forEach( (e) => console.log(e.stampa()) );

console.log("reset library");
filmLibrary.resetLibrary();
filmLibrary.printer();

console.log("***************************************\n");