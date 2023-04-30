import { Table, Button, Form } from 'react-bootstrap';
import MyRow from './MyRow';

function MyTable(props) {

    return (
        <Table>
            {/* <Table striped bordered hover> */}
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Favorite</th>
                    <th>Date</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.listOfFilms.map((e) =>
                        <MyRow e={e} key={e.id} />)
                }
                <tr>
                    <td><Form.Control type="text" name="title" /></td>
                    <td><Form.Control className="form-check-input" type="checkbox" name="favorite" /></td>
                    <td><Form.Control type="date" name="date" /></td>
                    <td><Form.Control className="w-25" type="text" name="rating" /></td>
                    <td><Button variant="secondary" >+</Button> </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default MyTable;