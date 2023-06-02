/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = 'http://localhost:3002/api';

/**
 * A utility function for parsing the HTTP response.
 */
// function getJson(httpResponsePromise) {
//   // server API always return JSON, in case of error the format is the following { error: <message> } 
//   return new Promise((resolve, reject) => {
//     httpResponsePromise
//       .then((response) => {
//         // check if the response status is in the 200 range
//         if (response.ok) {
//           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
//           response.json()
//             .then(json => resolve(json))
//             .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body

//         } else {
//           // analyzing the cause of error
//           response.json()
//             .then(obj =>
//               reject(obj)
//             ) // error msg in the response body
//             .catch(() => reject({ error: "Cannot parse server response" }))    // it was not able to extract the response body
//         }
//       })
//       .catch(() =>
//         reject({ error: "Cannot communicate with the server" })                // connection error
//       )
//   });
// }

function getFilms(filter) {
  // call  /api/films
  let query = filter === '' ? '' : '?filter=' + filter;

  return new Promise((resolve, reject) => {
    fetch(URL + '/films' + query,
      {
        method: 'GET',
        credentials: 'include'
      }    
    )
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
          resolve(response.json()
            .then(films => films.map((e) => (
              { id: e.id, title: e.title, favorite: e.favorite, watchDate: dayjs(e.watchDate), rating: e.rating }
            )))
            .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body
          )
        } else {
          // analyzing the cause of error
          response.json()
            .then((message) => { reject(message); })                            // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
        }
      }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
  });
  // return getJson(
  //     fetch(URL+'/films' + query)
  //   )
  //   .then( films => films.map((e) => (
  //             {id: e.id, title: e.title, 
  //             favorite: e.favorite, watchDate: dayjs(e.date),
  //             rating: e.rating}) ))
}

function getFilmById(id) {
  // call  /api/films/<id>
  return new Promise((resolve, reject) => {
    fetch(URL + `/films/${id}`)
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
          resolve(response.json()
            .then(film => ({ id: film.id, title: film.title, favorite: film.favorite, watchDate: dayjs(film.watchDate).format('YYYY/MM/DD'), rating: film.rating }))
            .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body
          )
        } else {
          // analyzing the cause of error
          response.json()
            .then((message) => { reject(message); })                            // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
        }
      }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
  });

  // return getJson(
  //     fetch(URL+`/films/${id}`)
  //   )
  //   .then( film => ({id: film.id, title: film.title, favorite: film.favorite, watchDate: dayjs(film.date), rating: film.rating}) )
}

function addFilm(film) {
  // call  /api/films
  return new Promise((resolve, reject) => {
    fetch(URL + '/films', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, film, { watchDate: film.watchDate.format('YYYY-MM-DD') }))
    })
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
          response.json()
            .then(id => resolve(id))
            .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body
        } else {
          // analyzing the cause of error
          response.json()
            .then((message) => { reject(message); })                            // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
        }
      }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
  });
  // return getJson(
  //   fetch(URL + '/films', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(film)
  //   })
  // )
}

function updateFilm(film) {
  // call  /api/films/<id>
  return new Promise((resolve, reject) => {
    fetch(URL + `/films/${film.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, film, { watchDate: film.watchDate.format('YYYY-MM-DD') }))
    })
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
          response.json()
            .then(film => resolve(film))
            .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body
        } else {
          // analyzing the cause of error
          response.json()
            .then((message) => { reject(message); })                            // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
        }
      }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
  });
  // return getJson(
  //   fetch(URL + `/films/${film.id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(film)
  //   })
  // )
}

function deleteFilm(id) {
  // call  /api/films/<id>
  return new Promise((resolve, reject) => {
    fetch(URL + `/films/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
          resolve(null);
        } else {
          // analyzing the cause of error
          response.json()
            .then((message) => { reject(message); })                            // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
        }
      }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
  });
  // return getJson(
  //   fetch(URL + `/films/${id}`, {
  //     method: 'DELETE'
  //   })
  // )
}

// function updateFavorite(id, favorite) {
//   // call  /api/films/<id>/favorite
//   return new Promise((resolve, reject) => {
//     fetch(URL + `/films/${id}/favorite`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ favorite: favorite })
//     })
//       .then((response) => {
//         // check if the response status is in the 200 range
//         if (response.ok) {
//           response.json()
//             .then(film => resolve(film))
//             .catch(() => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body
//         } else {
//           // analyzing the cause of error
//           response.json()
//             .then((message) => { reject(message); })                            // error msg in the response body
//             .catch(() => reject({ error: "Cannot parse server response" }))     // it was not able to extract the response body
//         }
//       }).catch(() => reject({ error: "Cannot communicate with the server" }))  // connection error
//   });
// }

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { 
  getFilms, getFilmById, addFilm, deleteFilm , updateFilm,
  logIn, logOut, getUserInfo
};
export default API;