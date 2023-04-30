import './MyCss.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Button, Form, Table, Nav} from 'react-bootstrap';
import { useState } from 'react';
import dayjs from 'dayjs';
import './films.js';
import MyNav from './MyNav';
import MyAside from './MyAside';
import MyTable from './MyTable';
import filmList from './films.js';
import selected_lst from './MyFilter';


function MyMain(props) {
  return (
    // Main content
    <main className="col-md-9 col-12 below-nav">
      <h1 className="mb-2" id="filter-title">{selected_lst[props.selected]}</h1>

      <MyTable listOfFilms={props.filmLista}/>
      

      {/* Add a new film... */}
      <Button type="button" className="btn btn-lg btn-dark fixed-right-bottom">&#43;</Button>
    </main>
  );
}

function App() {
  const [filmLista, setFilmLista] = useState(filmList);
  const [selected, setSelected] = useState(0);

  const chooseFilter = (idx) => {
    setSelected(idx);

    //console.log(idx);

    let sel_name = selected_lst[idx];

    //console.log(sel_name);

    switch(sel_name){
      case "All":
        setFilmLista(filmList);
        break;
      case "Favorites":
        setFilmLista(filmList.filter((e) => e.favorite));
        break;
      case "Best Rated":
        setFilmLista(filmList.filter((e) => e.rating >= 4));
        break;
      case "Seen Last Month":
        setFilmLista(filmList.filter((e) => e.watchDate != null && e.watchDate.isAfter(dayjs().subtract(1, 'months'))));
        break;
      case "Unseen":
        setFilmLista(filmList.filter((e) => e.watchDate == null));
        break;
      default:
        break;
    }
  }

  const updateFilm = (film) => {
    setFilmLista(filmLista.map((e) => {
      if(e.id === film.id){
        return film;
      }
      return e;
    }));
  }

   
  return (
    <>
      <MyNav />
      <Container fluid>
        <Row className='vheight-100'>
          <MyAside choose={chooseFilter}/>
          <MyMain filmLista={filmLista} selected={selected}/>
        </Row>
      </Container>      
    </>
  )
}

export default App
