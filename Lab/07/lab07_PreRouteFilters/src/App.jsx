import './MyCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import './films.js';
import filmList from './films.js';
import selected_lst from './MyFilter';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormRoute } from './components/MyForm';
import { Home } from './components/MyMain';




function DefaultRoute() {
  return (
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}


function App() {
  const [filmLista, setFilmLista] = useState(filmList);
  const [selected, setSelected] = useState(0);

  const chooseFilter = (idx) => {
    setSelected(idx);
    //console.log(idx);
  }

  const getFilteredFilmList = () => {
    let sel_name = selected_lst[selected];
    //console.log(sel_name);

    let film_lst;

    switch (sel_name) {
      case "All":
        film_lst = filmLista
        break;
      case "Favorites":
        film_lst = filmLista.filter((e) => e.favorite);
        break;
      case "Best Rated":
        film_lst = filmLista.filter((e) => e.rating >= 4);
        break;
      case "Seen Last Month":
        film_lst = filmLista.filter((e) => e.watchDate != null && e.watchDate.isAfter(dayjs().subtract(1, 'months')));
        break;
      case "Unseen":
        film_lst = filmLista.filter((e) => e.watchDate == null);
        break;
      default:
        film_lst = filmLista;
        break;
    }
    return film_lst;
  }

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
      <Routes>
        <Route path='/' element={
          <Home filmLista={getFilteredFilmList()} selected={selected} 
          choose={chooseFilter} deleteFilm={deleteFilm} editFilm={editFilm}/>}
        />
        <Route path='/add' element={
          <FormRoute addToList={addToList} listOfFilms={filmLista} />}
        />
        <Route path='/edit/:filmId' element={
          <FormRoute listOfFilms={filmLista} editFilm={editFilm}/>} 
        />
        <Route path='/*' element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App