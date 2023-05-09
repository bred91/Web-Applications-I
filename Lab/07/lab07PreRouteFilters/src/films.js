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
  // id, title, favorite, watchDate, rating
  new Film(1, "Pulp Fiction", true, "2023-03-10", 5),
  new Film(2, "21 Grams", true, "2023-03-17", 4),
  new Film(3, "Star Wars", false),
  new Film(4, "Matrix", true),
  new Film(5, "Shrek", false, "2023-03-21", 3)
];

export default filmList;