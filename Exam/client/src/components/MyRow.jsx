import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';
import '../MyCSS.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MyViewModal from './MyModal';

function MyRow(props) {
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();
    const e = props.e;

    let statusClass = 'text-center ';
    // colors the background of the row
    switch (e.pageStatus) {
        case 'added':
            statusClass += 'table-success';
            break;
        case 'deleted':
            statusClass += 'table-danger';
            break;
        case 'updated':
            statusClass += 'table-warning';
            break;
        default:
            break;
    }


    return (
        <tr className={statusClass}>
            <td>{e.title}</td>
            <td>{e.author}</td>
            <td>{e.creationDate.format('YYYY/MM/DD')}</td>
            <td>{e.publicationDate == null ? '' : e.publicationDate.format('YYYY/MM/DD')}</td>
            <td>{e.status}</td>
            <td><Button variant='primary' className='mx-2 btn-sm' onClick={() => setModalShow(true)}>
                <i className='bi bi-search' /></Button></td>
            {
                props.backoffice ?
                    props.user && (props.user.id === e.authorId || props.user.isAdmin) ?
                        <>
                            <td><Button variant='secondary' className='mx-2 btn-sm'
                                onClick={() => { navigate(`/backoffice/edit/${e.id}`) }}
                            ><i className='bi bi-pencil-square' /></Button></td>
                            <td><Button variant='danger' className='mx-2 btn-sm'
                                onClick={() => props.deletePage(e.id)}
                            ><i className='bi bi-trash icon-red' /></Button>
                            </td>
                        </>
                        :
                        <>
                            <td></td>
                            <td></td>
                            <td></td>
                        </>
                    :
                    null
            }
            <MyViewModal show={modalShow} onHide={() => setModalShow(false)} page={e} imageslist={props.imagesList} />
        </tr>
    );
}

export default MyRow;