import { Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import dayjs from 'dayjs';

function AnswerForm(props) {
    const [text, setText] = useState("");
    const [respondent, setRespondent] = useState("");
    const [score, setScore] = useState(0);
    const [date, setDate] = useState('');

    const [errorMsg, setErrorMsg] = useState('');

    function handleRespondent(event) {
        const value = event.target.value;
        // every time the user types a character, we want to update the state
        // in this case everything becomes uppercase
        setRespondent(setUppperCase(value));
    }

    const handleScore = (event) => {
        const value = event.target.value;

        // in this case we want to allow only numbers and empty string
        // using isNaN we can check if the value is a number
        // it is a quite risky way to check if the value is a number
        // a better way is to force a type number
        // if(!isNaN(value) || value === "")
        //     setScore(value);

        setScore(value);
    }


    function handleSubmit(event){
        // prevent the default behaviour of the submit button in order to avoid a page reload
        event.preventDefault();

        // Form validation
        if(date === '')
            setErrorMsg("Data non valida");
        else if(isNaN(score))
            setErrorMsg("Score non valido");
        else if(parseInt(score) < 0){
            setErrorMsg("Score negativo non valido");
            // we want to show the error message for 3 seconds
            // i need to be careful with the fact that the user could generate a new error message before the timeout expires
            // in this case the timeout will be reset
            // an alternative solution is to use an array of error messages

            // it is NOT required for the exam
            setTimeout(() => setErrorMsg(''), 3000);
        }
        else {    
            const e = {
                date: dayjs(date), 
                text: text, // we create a property called text and we assign the value of the text variable
                respondent: respondent,
                score: parseInt(score),

                // the unique key will (must) be generated by the server !!!
                // in this case we use the index of the element in the array as key to avoid a warning
                // in a real application we should use a unique id FROM THE SERVER
                // THIS IS JUST A TEMPORARY TRICK !!!
            };
            
            props.addToList(e);
        }
    }

    return (
        <>
            {errorMsg ? <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>{errorMsg}</Alert> : false}
            {/* With Form we can create a form with a submit button */}
            {/* we want to prevent the default behaviour of the submit button in order to avoid a page reload */}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Date</Form.Label>
                    {/* if we want to force the user to select a date we can use the required attribute */}
                    {/* it is a passable solution but it is not the best one */}
                    <Form.Control type="date" name="date" value={date} onChange={ev => setDate(ev.target.value)}/>
                </Form.Group>  
                <Form.Group>
                    <Form.Label>Text</Form.Label>
                    <Form.Control type="text" name="text" value={text} onChange={ev => setText(ev.target.value)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Author</Form.Label>                 
                    <Form.Control type="text" name="respondent" value={respondent} onChange={handleRespondent}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Score</Form.Label>
                    <Form.Control type="number" name="score" value={score} onChange={handleScore}/>
                </Form.Group>

                <Button type="submit" variant="primary" className="m-1">Add</Button> 
                <Button variant="warning" onClick={props.closeForm} className="m-1">Cancel</Button>
            </Form>            
        </>
    );
}

export default AnswerForm;