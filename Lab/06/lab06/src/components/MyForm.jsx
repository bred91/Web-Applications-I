import { useState } from 'react';
import { Form, Button, Row, Col, Alert} from 'react-bootstrap';
import '../MyCss.css';
import dayjs from 'dayjs';


function MyForm(props){
    const [title, setTitle] = useState(props.film ? props.film.title : '');
    const [favorite, setFavorite] = useState(props.film ? props.film.favorite : false);
    const [date, setDate] = useState(props.film && props.film.watchDate ?  props.film.watchDate.format('YYYY-MM-DD') : '');
    const [rating, setRating] = useState(props.film? props.film.rating : '');

    const [starting, setStarting] = useState(true);

    const [errorMsg, setErrorMsg] = useState('');

    const handleUpdate = (event) => {
        event.preventDefault();

        setStarting(false);

        // console.log(title)
        // console.log(date)
        // console.log(rating)
        let msg = validation();

        if(msg !== '') {
            setErrorMsg(msg);
            return;
        }

        const e = {
            id: props.film.id,
            title: title,
            favorite: favorite,            
            watchDate: date != ""? dayjs(date) : null,
            rating: rating == undefined ? null : parseInt(rating)
        };

        setErrorMsg('');
        props.editFilm(e);
        props.closeForm();
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setStarting(false);

        let msg = validation();

        if(msg !== '') {
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
        props.closeForm();
    }

    function validation () {
        let message = '';
        if(title === '' || date === '' || rating === ''){
            if(title === ''){
                message += '- Title is required\n';
            }
                

            if(date === '')
                message += '- Date is required\n';
            if(rating === '')
                message += '- Rating is required\n';
        }
        if(rating < 0 || rating > 5)
            message += '- Rating must be between 0 and 5\n';
        if(date !== '' && dayjs(date).isAfter(dayjs()))
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
        <div className="fixed-right-bottom">
            {errorMsg ? <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert> : false}
            {/* With Form we can create a form with a submit button */}
            {/* we want to prevent the default behaviour of the submit button in order to avoid a page reload */}
            <Form onSubmit={handleSubmit}> 
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control id='titleID' isInvalid={!starting && title === ""} placeholder='Title' size="sm" type="text" name="titleID" value={title} onChange={handleTitle}/>
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Favorite</Form.Label>
                            <Form.Check size="sm" className="checking" type="checkbox" name="text" value={favorite} onChange={handleFavorite} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control isInvalid={!starting && (date === "" || date === undefined)} size="sm" type="date" name="date" value={date} max={dayjs().format("YYYY-MM-DD")} onChange={handleDate}/>
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col> 
                    <Col>
                        <Form.Group>
                            <Form.Label>Rating</Form.Label>
                            <Form.Control isInvalid={!starting && (rating === "" || rating === undefined)} size="sm" className="w-30" type="number" min="0" max="5" name="rating" value={rating} onChange={handleRating}/>
                            <Form.Control.Feedback type="invalid">
                                Required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>                                      
                </Row>
                <Row>
                    <Col>
                        {props.film ? <Button size="sm" type="button" variant="success" className="m-1" onClick={handleUpdate}>Update</Button>
                            : <Button size="sm" type="submit" variant="success" className="m-1">Add</Button>}
                        <Button size="sm" variant="warning" onClick={props.closeForm} className="m-1">Cancel</Button>
                    </Col>  
                </Row>            
            </Form>            
        </div>
    );
}


export default MyForm;