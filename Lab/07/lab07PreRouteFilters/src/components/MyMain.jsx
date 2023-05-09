import MyTable from "./MyTable";
import selected_lst from "../MyFilter";
import { Link } from "react-router-dom";
import { Container, Row, Button } from "react-bootstrap";
import MyNav from "./MyNav";
import MyAside from "./MyAside";

function Home(props) {
  return (
    <>
      <MyNav />
      <Container fluid>
        <Row className='vheight-100'>
          <MyAside choose={props.choose} selected={props.selected} />
          <MyMain filmLista={props.filmLista} selected={props.selected} deleteFilm={props.deleteFilm} editFilm={props.editFilm}/>
        </Row>
      </Container>
    </>
  );
}


function MyMain(props) {

  return (
    // Main content
    <main className="col-md-9 col-12 below-nav">
      <h1 className="mb-2" id="filter-title">{selected_lst[props.selected]}</h1>

      <MyTable listOfFilms={props.filmLista} deleteFilm={props.deleteFilm} editFilm={props.editFilm}/>

      <Link to="/add">
        <Button type="button" className="btn btn-dark fixed-right-bottom">&#43;</Button>
      </Link>

    </main>
  );
}

export { Home, MyMain };