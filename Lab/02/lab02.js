"use strict";

const dayjs = require("dayjs");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("films.db", (err) => { if(err) throw err; });

function Film(id, title, isFavorite = false, watchDate, rating) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object
    this.watchDate = watchDate && dayjs(watchDate);
  
    this.toString = () => {
      return `Id: ${this.id}, ` +
      `Title: ${this.title}, Favorite: ${this.favorite}, ` +
      `Watch date: ${this.formatWatchDate('MMMM D, YYYY')}, ` +
      `Score: ${this.formatRating()}` ;
    }
  
    this.formatWatchDate = (format) => {
      return this.watchDate ? this.watchDate.format(format) : '<not defined>';
    }
  
    this.formatRating = () => {
      return this.rating  ? this.rating : '<not assigned>';
    }
  }
  
  
  function FilmLibrary() {
    this.list = [];
  
    this.print = () => {
      console.log("***** List of films *****");
      this.list.forEach((item) => console.log(item.toString()));
    }
  
    this.addNewFilm = (film) => {
      if(!this.list.some(f => f.id == film.id))
        this.list.push(film);
      else
        throw new Error('Duplicate id');
    };
  
    this.deleteFilm = (id) => {
      const newList = this.list.filter(function(film, index, arr) {
        return film.id !== id;
      })
      this.list = newList;
    }
  
    this.resetWatchedFilms = () => {
      this.list.forEach((film) => delete film.watchDate);
    }
  
    this.getRated = () => {
      const newList = this.list.filter(function(film, index, arr) {
        return film.rating > 0;
      })
      return newList;
    }
  
    this.sortByDate = () => {
      const newArray = [...this.list];
      newArray.sort((d1, d2) => {
        if(!(d1.watchDate)) return  1;   // null/empty watchDate is the lower value
        if(!(d2.watchDate)) return -1;
        return d1.watchDate.diff(d2.watchDate, 'day')
      });
      return newArray;
    }
  
    this.getAll = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films";

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
                    resolve(ans);
                }
            });
        });
    }

    this.getFavorite = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE favorite = 1";

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
                    resolve(ans);
                }
            });
        });
    }

    this.watchedToday = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchDate IS NOT NULL"

            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
                    resolve(ans);
                }          
            });
        });
    }

    this.watchedBefore = (date) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM films WHERE watchdate < ?";

            db.all(sql, [date], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
                    resolve(ans);
                }          
            }); 
        });
    }

    this.ratingMajor = (rating) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM films WHERE RATING >= ?";

        db.all(sql, [rating], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
            resolve(ans);
          }
        });
      });
    }

    this.filmLike = (stringA) => {
      return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM films WHERE title LIKE ?";
        
        db.all(sql, ["%" + stringA + "%"], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const ans = rows.map((row) => new Film(row.id, row.title, row.favorite, dayjs(row.watchdate), row.rating));
            resolve(ans);
          }
        }
        );
      });
    }

    this.addMovie = (film) => {
      return new Promise((resolve, reject) => {
        const sql = "INSERT INTO films (title, favorite, watchdate, rating) VALUES (?, ?, ?, ?)";

        db.run(sql, [film.title, film.favorite, film.watchDate.format('YYYY-MM-DD'), film.rating], function(err) {
          // this.lastID won't be available with an arrow function here
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      });
    }

    this.deleteMovie = (id) => {
      return new Promise((resolve, reject) => {
          const sql = "DELETE FROM films WHERE id = ?";

          db.run(sql, [id], function(err) {
              if (err) {
                  reject(err);
              } else {
                  resolve(this.changes);
              }
          });
      });
    }
  }
  
  
  function main() {
    const library = new FilmLibrary();

    
    library.getAll().then((films) => {
        console.log("\n***** List of films *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });   

    
    library.getFavorite().then((films) => {
        console.log("***** List of favorite films *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });

    library.watchedToday().then((films) => {
        console.log("***** List of watched films *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });

    library.watchedBefore("2023-03-18").then((films) => {
        console.log("***** List of watched films before 2023-03-18 *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });
    

    library.ratingMajor(4).then((films) => {
        console.log("***** List of films with rating >= 4 *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });


    library.filmLike("War").then((films) => {
        console.log("***** List of films with title like 'War' *****");
        films.forEach((film) => console.log(film.toString()));
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });

    // const film6 = new Film(6, "Shrek 2", false, dayjs("2023-03-26"), 3);
    // library.addMovie(film6).then((id) => {
    //     console.log("***** New film added *****");
    //     console.log(`New film id: ${id}`);
    //     console.log("*************************\n")
    // }).catch((err) => {
    //     console.log(err);
    // });


    library.deleteMovie(7).then((id) => {
        console.log("***** Film deleted *****");
        console.log(`Deleted film id: 7`);
        console.log("*************************\n")
    }).catch((err) => {
        console.log(err);
    });

    // Additional instruction to enable debug 
    debugger;
  }
  
  main();