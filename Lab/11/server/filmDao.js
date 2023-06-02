'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if(err) throw err;
});

const filters = {
  'filter-all':       { label: 'All', id: 'filter-all', filterFn: () => true}, 
  'filter-favorite':  { label: 'Favorites', id: 'filter-favorite', filterFn: film => film.favorite}, 
  'filter-best':      { label: 'Best Rated', id: 'filter-best', filterFn: film => film.rating >= 5}, 
  'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFn: film => isSeenLastMonth(film)}, 
  'filter-unseen':    { label: 'Unseen', id: 'filter-unseen', filterFn: film => film.watchDate.isValid()  ? false : true }
};

const isSeenLastMonth = (film) => {
  if (film.watchDate == null || typeof film.watchDate.diff !== 'function')
    return false;
  return film.watchDate.diff(dayjs(), 'month') === 0;
};

// get all films
exports.listFilms = (filter, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE user=?';
    db.all(sql, [userId], (err, rows) => {
      if(err) {
        reject(err);
        return;
      }
      
      const films = rows.map((row) => {
        const film = ({...row, watchDate: dayjs(row.watchdate)});
        delete film.watchdate;
        return film;
        });
      if(filter && filters[filter]) {
        resolve(films.filter(filters[filter].filterFn));
      }
      else {
        resolve(films);
      }
    });
  });
}

// // get a film by id
// exports.filmById = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM films WHERE id = ?';
//     db.get(sql, [id], (err, row) => {
//       if(err) {
//         reject(err);
//         return;
//       }

//       if(row) {
//         const film = {...row, watchDate: dayjs(row.watchdate)};
//         delete film.watchdate;
//         resolve(film);
//       }
//       else {
//         reject({error: 'Film not found.'});
//       }
//     });
//   });
// }


// create a new film
exports.createFilm = (film) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films(title, favorite, watchdate, rating, user) VALUES(?,?,?,?,?)';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.user], function(err) {
      if(err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    }
    );
  });
}

// update a film
exports.updateFilm = (film, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?, favorite=?, watchdate=?, rating=? WHERE id=? AND user=?';
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, film.id, userId], function(err) {
      if(err) {
        reject(err);
        return;
      }
      resolve(this.changes);  // return the number of affected rows
    }
    );
  });
}


// // update Favorite
// exports.updateFavorite = (id, favorite) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'UPDATE films SET favorite=? WHERE id=?';
//     db.run(sql, [favorite, id], function(err) {
//       if(err) {
//         reject(err);
//         return;
//       }
//       resolve(exports.filmById(id));
//     }
//     );
//   });
// }

// // update Rating
// exports.updateRating = (id, rating) => {
//   return new Promise((resolve, reject) => {
//     const sql = 'UPDATE films SET rating=? WHERE id=?';
//     db.run(sql, [rating, id], function(err) {
//       if(err) {
//         reject(err);
//         return;
//       }
//       resolve(exports.filmById(id));
//     }
//     );
//   });
// }

// delete a film
exports.deleteFilm = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id=? AND user=?';
    db.run(sql, [id, userId], (err) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(this.changes);  // return the number of affected rows
    });
  });
}