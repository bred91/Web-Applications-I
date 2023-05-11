import MyAside from './components/MyAside';
import { Link, Outlet, useParams, useLocation } from 'react-router-dom';
import MyTable from './components/MyTable';
import { Container, Row, Col } from 'react-bootstrap';

function DefaultRoute(props) {
    const location = useLocation();

    const { filterLabel } = useParams();
    const filterId = filterLabel || (location.pathname === "/" && 'filter-all');

    return (
        <Row className="vh-100">
            <Col md={4} xl={3} bg="light" className="below-nav" id="left-sidebar">
                <MyAside selected={filterId} items={props.filters} />
            </Col>
            <Col md={8} xl={9} className="below-nav">
                <Outlet />
            </Col>
        </Row>
    );
}

function MainLayout(props) {
    //console.log(props);
    const { filterLabel } = useParams();
    const filterName = props.filters[filterLabel] ? props.filters[filterLabel].label : 'All';
    //console.log(filterName);
    // When an unpredicted filter is written, all the films are displayed.
    const filteredFilms = (filterLabel in props.filters) ? props.filmLista.filter(props.filters[filterLabel].filterFunction) : props.filmLista;
    //console.log(filteredFilms);
    const location = useLocation();

    return (
        <>
            <h1 className="pb-3">Filter: <span className="notbold">{filterName}</span></h1>
            <MyTable listOfFilms={filteredFilms}
                deleteFilm={props.deleteFilm} editFilm={props.editFilm} />
            <Link className="btn btn-dark fixed-right-bottom" to="/add" state={{ nextpage: location.pathname }}> &#43; </Link>
        </>
    )
}

function NotFoundRoute() {
    return (
      <Container className='App'>
        <h1>No data here...</h1>
        <h2>This is not the route you are looking for!</h2>
        <Link to='/'>Please go back to main page</Link>
      </Container>
    );
  }

export { DefaultRoute, MainLayout, NotFoundRoute };