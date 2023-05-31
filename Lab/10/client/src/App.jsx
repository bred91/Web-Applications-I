import './MyCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './films.js';
import API from './API';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FormRoute } from './components/MyForm';
import { DefaultRoute, MainLayout, NotFoundRoute } from './PageLayout';
import MyNav from './components/MyNav';


function App() {
  const [filmLista, setFilmLista] = useState([]);  
  const [selectedFilter, setSelectedFilter] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dirty, setDirty] = useState(false);


  const filters = {
    'filter-all':       { label: 'All', url: '', filterFunction: () => true},
    'filter-favorite':  { label: 'Favorites', url: '/filter/filter-favorite', filterFunction: film => film.favorite},
    'filter-best':      { label: 'Best Rated', url: '/filter/filter-best', filterFunction: film => film.rating >= 5},
    'filter-lastmonth': { label: 'Seen Last Month', url: '/filter/filter-lastmonth', filterFunction: film => isSeenLastMonth(film)},
    'filter-unseen':    { label: 'Unseen', url: '/filter/filter-unseen', filterFunction: film => film.watchDate ? false : true}
  };
  
  const isSeenLastMonth = (film) => {
    if('watchDate' in film && film.watchDate) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(),'month')
      const isLastMonth = diff <= 0 && diff > -1 ;      // last month
      return isLastMonth;
    }
  }

  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
    else if (err.error)
      errMsg = err.error;
        
    setErrorMsg(errMsg);
    //setTimeout(()=>setDirty(true), 2000);  // Fetch correct version from server, after a while
  }  

  const userId = 1;

  useEffect(() => {
    setDirty(true);
  }, []);

  useEffect(() => {
    if (dirty && selectedFilter) {
      API.getFilms(selectedFilter)
        .then((films) => {
          setFilmLista(films)
          setDirty(false)
        })
        .catch((err) => handleError(err));
    }
  }, [selectedFilter, dirty]);



  const editFilm = (film) => {
    setFilmLista(filmLista.map((e) => {
      if (e.id === film.id) {
        film.status = 'updated';
        return film
      }
      return e;
    }));

    film.user = userId;
    API.updateFilm(film)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  const deleteFilm = (id) => {
    setFilmLista(filmLista.map((e) => {
      if (e.id === id) {
        e.status = 'deleted';
        return e
      }
      return e;
    }));
    // setFilmLista((oldList) => oldList.filter(
    //   (e) => e.id !== id
    // ));
    API.deleteFilm(id)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  const addToList = (e) => {
    e.user = userId;
    // create a new array with the old elements and the new one
    // using the spread operator
    setFilmLista((oldList) => { e.status = 'added'; return [...oldList, e]});

    API.addFilm(e)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  // const modFavorite = (id, favorite) => {
  //   setFilmLista(filmLista.map((e) => {
  //     if (e.id === id) {
  //       e.favorite = favorite;
  //       e.status = 'updated';
  //       return e
  //     }
  //     return e;
  //   }));

  //   API.updateFavorite(id, favorite)
  //     .then(() => setDirty(true))
  //     .catch((err) => handleError(err));
  // }


  return (
    <BrowserRouter>
      <Container fluid className='App'>
        <MyNav />
        <Routes>
          <Route path='/' element={< DefaultRoute filmLista={filmLista} filters={filters} setSelectedFilter={setSelectedFilter}/>} >
            <Route index element={<MainLayout filmLista={filmLista} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path='filter/:filterLabel' element={<MainLayout filmLista={filmLista} filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path='/add' element={<FormRoute filters={filters} addToList={addToList} listOfFilms={filmLista} />} />
            <Route path='/edit/:filmId' element={<FormRoute filters={filters} listOfFilms={filmLista} editFilm={editFilm} />} />
            <Route path='*' element={<NotFoundRoute />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App