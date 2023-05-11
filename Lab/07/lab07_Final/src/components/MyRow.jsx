import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';
import '../MyCss.css';
import { Link } from 'react-router-dom';

function MyRow(props) {
    const e = props.e;

    return (
        <tr>
            {e.favorite != null && e.favorite == true ? <td className='text-danger'>{e.title}</td>
                : <td>{e.title}</td>}
            <td>
                <input className='checking' type="checkbox" 
                    checked={e.favorite == null ? false : e.favorite} //readOnly={true}
                    onChange={() => props.editFilm({ ...e, favorite: !e.favorite })}>
                </input>
            </td>
            <td>{e.watchDate == null ? false : e.watchDate.format("YYYY-MM-DD")}</td>
            {/* <td>{e.rating}</td> */}
            <td>
                <Rating rating={e.rating} maxStars={5} editFilm={props.editFilm} film={e}/>
            </td>
            <td>
                <Link to={`/edit/${e.id}`} className='mg-auto'>
                    <i className="bi bi-pencil icon-black"></i>                               
                </Link>                
                {/* <Button variant="danger" className="m-1">Delete</Button> */}
            </td>
            <td>
                <i className="bi bi-trash icon-red" onClick={() => props.deleteFilm(e.id)}></i>
            </td>
        </tr>
    );
}

function Rating(props) {
    return [...Array(props.maxStars)].map((el, index) =>
        <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} 
            onClick={() => props.editFilm({ ...props.film, rating: index + 1 })}
        />
    )
}

export default MyRow;