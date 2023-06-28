import { Link, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { MyPagesTable } from './MyTable';

function DefaultRoute(props) {

    return (
        <Row className="vh-100">
            <Col bg="light" className="below-nav secondary">
                <Outlet />
            </Col>
        </Row>
    );
}

function MainLayout(props) {

    return (
        <>
            <Container>
                <MyPagesTable user={props.user} pages={props.pages} backoffice={props.backoffice} deletePage={props.deletePage} setPage={props.setPage} imagesList={props.imagesList} />
                {props.loggedIn && props.backoffice ?
                    <Container className='fixed-bottom d-flex flex-row-reverse'>
                        <Link className="btn btn-dark mb-2 " to="/backoffice/add"> &#43; </Link>
                    </Container>
                    : null}
            </Container>
        </>

    )
}


function NotFoundRoute() {
    return (
        <Container className='vh-100 text-center'>
            <h1>No data here...</h1>
            <h2>This is not the route you are looking for!</h2>
            <Link to='/'>Please go back to main page</Link>
        </Container>
    );
}


function LoadingLayout() {
    return (
        <>
            <Row className="vh-100">
                <Col md={4} bg="light" className="below-nav" id="left-sidebar">
                </Col>
                <Col md={8} className="below-nav">
                    <h1>Pages are loading ...</h1>
                </Col>
            </Row>
        </>
    )
}

export { DefaultRoute, MainLayout, NotFoundRoute, LoadingLayout };