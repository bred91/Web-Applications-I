/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = 'http://localhost:3002/api';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        // check if the response status is in the 200 range
        if (response.ok) {
         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( () => reject({ error: "Cannot parse server response" }))   // it was not able to parse the response body

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(() => reject({ error: "Cannot parse server response" }))    // it was not able to extract the response body
        }
      })
      .catch(() => 
        reject({ error: "Cannot communicate with the server"  })                // connection error
      ) 
  });
}

async function getFilms(filter) {
  // call  /api/films
  let query = filter === ''? '' : '?filter=' + filter;

  return getJson(
      fetch(URL+'/films' + query)
    )
    .then( films => films.map((e) => (
              {id: e.id, title: e.title, 
              favorite: e.favorite, watchDate: dayjs(e.date),
              rating: e.rating}) ))
}

async function getFilmById(id) {
    // call  /api/films/<id>
    return getJson(
        fetch(URL+`/films/${id}`)
      )
      .then( film => ({id: film.id, title: film.title, favorite: film.favorite, watchDate: dayjs(film.date), rating: film.rating}) )
  }



const API = {getFilms, getFilmById};
export default API;