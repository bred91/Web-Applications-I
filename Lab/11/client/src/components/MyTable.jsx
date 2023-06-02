import React from 'react';
import { Table } from 'react-bootstrap';
import MyRow from './MyRow';

function MyTable(props) {

    return (
        <Table>
            {/* <Table striped bordered hover> */}
            <thead>
                <tr>
                    <th >Title</th>
                    <th>Favorite</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.listOfFilms.map((e) =>
                        <MyRow e={e} key={e.id} deleteFilm={props.deleteFilm} editFilm={props.editFilm} />)
                }                
            </tbody>
        </Table>
    );
}

export default MyTable;