import './MyCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row} from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import './films.js';
import MyNav from './components/MyNav';
import MyAside from './components/MyAside';
import filmList from './films.js';
import selected_lst from './MyFilter';
import MyMain from './components/MyMain';


function App() {
  const [defaultFilmLista, setDefaultFilmLista] = useState(filmList);
  const [filmLista, setFilmLista] = useState(defaultFilmLista);
  const [selected, setSelected] = useState(0);  

  const chooseFilter = (idx) => {
    setSelected(idx);
    //console.log(idx);

    let sel_name = selected_lst[idx];
    //console.log(sel_name);

    switch(sel_name){
      case "All":
        setFilmLista(defaultFilmLista);
        break;
      case "Favorites":
        setFilmLista(defaultFilmLista.filter((e) => e.favorite));
        break;
      case "Best Rated":
        setFilmLista(defaultFilmLista.filter((e) => e.rating >= 4));
        break;
      case "Seen Last Month":
        setFilmLista(defaultFilmLista.filter((e) => e.watchDate != null && e.watchDate.isAfter(dayjs().subtract(1, 'months'))));
        break;
      case "Unseen":
        setFilmLista(defaultFilmLista.filter((e) => e.watchDate == null));
        break;
      default:
        break;
    }
  }

  const editFilm = (film) => {
    setFilmLista(filmList.map((e) => {
      if(e.id === film.id){
        return film;
      }
      return e;
    }));
    setDefaultFilmLista(filmList.map((e) => {
      if(e.id === film.id){
        return film;
      }
      return e;
    }));
  }

  const deleteRow = (id) => {
    setFilmLista((oldList) => oldList.filter(
      (e) => e.id !== id
    ));
  }

  const addToList = (e) => {
    // create a new array with the old elements and the new one
    // using the spread operator
    setFilmLista((oldList) => [...oldList, e]);
    setDefaultFilmLista((oldList) => [...oldList, e]); 
  }

   
  return (
    <>
      <MyNav />
      <Container fluid>
        <Row className='vheight-100'>
          <MyAside choose={chooseFilter}/>
          <MyMain filmLista={filmLista} selected={selected} addToList={addToList} editFilm={editFilm}/>          
        </Row>
      </Container>      
    </>
  )
}

export default App
