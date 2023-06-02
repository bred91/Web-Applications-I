import { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import '../MyCss.css';
import dayjs from 'dayjs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MyNav from './MyNav';

function FormRoute(props) {
    //console.log(props);
    return (
        <>
            <MyNav />
            <Container fluid>
                <Row className='vheight-100'>
                    <MyForm addToList={props.addToList} listOfFilms={props.listOfFilms} editFilm={props.editFilm}/>
                </Row>
            </Container>
        </>
    );
}

function MyForm(props) {
    const navigate = useNavigate();
    const { filmId } = useParams();
    // console.log(filmId);
    // console.log(props);
    const objToEdit = filmId && props.listOfFilms && props.listOfFilms.find(e => e.id === parseInt(filmId));
    // console.log(objToEdit.watchDate);
    const [title, setTitle] = useState(objToEdit ? objToEdit.title : '');
    const [favorite, setFavorite] = useState(objToEdit ? objToEdit.favorite : false);
    const [date, setDate] = useState(objToEdit && objToEdit.watchDate ? objToEdit.watchDate.format('YYYY-MM-DD') : '');
    const [rating, setRating] = useState(objToEdit ? objToEdit.rating : '');
    const [starting, setStarting] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');


    const handleUpdate = (event) => {
        event.preventDefault();

        setStarting(false);

        // console.log(title)
        // console.log(date)
        // console.log(rating)
        let msg = validation();

        if (msg !== '') {
            setErrorMsg(msg);
            return;
        }

        const e = {
            id: objToEdit.id,
            title: title,
            favorite: favorite,
            watchDate: date != "" ? dayjs(date) : null,
            rating: rating == undefined ? null : parseInt(rating)
        };

        setErrorMsg('');
        props.editFilm(e);
        navigate('/');
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setStarting(false);

        let msg = validation();

        if (msg !== '') {
            setErrorMsg(msg);
            return;
        }


        const e = {
            id: Math.max(...props.listOfFilms.map((f) => f.id)) + 1, // temporary trick !!!
            title: title,
            favorite: favorite,
            watchDate: dayjs(date),
            rating: parseInt(rating)
        };

        setErrorMsg('');
        props.addToList(e);
        navigate('/');
    }

    function validation() {
        let message = '';
        if (title === '' || date === '' || rating === '') {
            if (title === '') {
                message += '- Title is required\n';
            }


            if (date === '')
                message += '- Date is required\n';
            if (rating === '')
                message += '- Rating is required\n';
        }
        if (rating < 0 || rating > 5)
            message += '- Rating must be between 0 and 5\n';
        if (date !== '' && dayjs(date).isAfter(dayjs()))
            message += '- Date can not be in the future\n';

        return message;
    }

    const handleTitle = (event) => {
        setTitle(event.target.value);
    }

    const handleFavorite = (event) => {
        setFavorite(event.target.checked);
    }

    const handleDate = (event) => {
        setDate(event.target.value);
    }

    const handleRating = (event) => {
        setRating(event.target.value);
    }

    return (
        <Container className='col-md-4 col-5 below-nav bg-light'>            
            {/* With Form we can create a form with a submit button */}
            {/* we want to prevent the default behaviour of the submit button in order to avoid a page reload */}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">Title</Form.Label>
                            <Form.Control id='titleID' isInvalid={!starting && title === ""} placeholder='Title' type="text" name="titleID" value={title} onChange={handleTitle} />
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center"> Favorite</Form.Label>
                            <Form.Check className="d-flex justify-content-center" type="checkbox" name="text" checked={favorite} onChange={handleFavorite} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">Date</Form.Label>
                            <Form.Control isInvalid={!starting && (date === "" || date === undefined)} type="date" name="date" value={date} max={dayjs().format("YYYY-MM-DD")} onChange={handleDate} />
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">Rating</Form.Label>
                            <Form.Control isInvalid={!starting && (rating === "" || rating === undefined)} className="w-30 checking justify-content-center" type="number" min="0" max="5" name="rating" value={rating} onChange={handleRating} />
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col className='d-flex justify-content-center'>
                        {filmId ? <Button type="button" variant="success" className="m-1" onClick={handleUpdate}>Update</Button>
                            : <Button type="submit" variant="success" className="m-1">Add</Button>}
                        <Link to="/"><Button variant="warning" className="m-1">Cancel</Button></Link>
                    </Col>
                </Row>
            </Form>
            <br />
            {errorMsg ? <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
                {errorMsg.split("-").map((e) => <Row className='justify-content-center'>{e}</Row>)}
                </Alert> 
                    : false}
        </Container>
    );
}


export { MyForm, FormRoute };