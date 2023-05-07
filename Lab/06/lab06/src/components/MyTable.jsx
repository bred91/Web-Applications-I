import React from 'react';
import { Table } from 'react-bootstrap';
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
                        <MyRow e={e} key={e.id} editFilm={props.editFilm} plusVisible={props.plusVisible}/>)
                }                
            </tbody>
        </Table>
    );
}

export default MyTable;