import './MyCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import './films.js';
import FILMS from './films.js';
import selected_lst from './MyFilter';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormRoute } from './components/MyForm';
import { DefaultRoute, MainLayout, NotFoundRoute } from './PageLayout';
import MyNav from './components/MyNav';


function App() {
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

  const [filmLista, setFilmLista] = useState(FILMS);  

  const editFilm = (film) => {
    setFilmLista(filmLista.map((e) => {
      if (e.id === film.id) {
        return film;
      }
      return e;
    }));
  }

  const deleteFilm = (id) => {
    setFilmLista((oldList) => oldList.filter(
      (e) => e.id !== id
    ));
  }

  const addToList = (e) => {
    // create a new array with the old elements and the new one
    // using the spread operator
    setFilmLista((oldList) => [...oldList, e]);
  }


  return (
    <BrowserRouter>
      <Container fluid className='App'>
        <MyNav />
        <Routes>
          <Route path='/' element={< DefaultRoute filmLista={filmLista} filters={filters} />} >
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