"use strict";

import dayjs from "dayjs";

function Film(id, title, favorite, watchDate, rating) {
  this.id = id;
  this.title = title;
  this.favorite = favorite;
  this.rating = rating && parseInt(rating);
  this.watchDate = watchDate && dayjs(watchDate);
}

const filmList = [
  { id: 1, title: "Pulp Fiction", favorite: true, watchDate: dayjs("2023-03-10"), rating: 5 },
  { id: 2, title: "21 Grams", favorite: true, watchDate: dayjs("2023-03-17"), rating: 5 },
  { id: 3, title: "Star Wars", favorite: false },
  { id: 4, title: "Matrix", favorite: true },
  { id: 5, title: "Shrek", favorite: false, watchDate: dayjs("2023-04-13"), rating: 3 }
];

export default filmList;