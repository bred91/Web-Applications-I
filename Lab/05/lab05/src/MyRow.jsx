import dayjs from 'dayjs';
import './MyCss.css';

function MyRow(props) {
    const e = props.e;

    return (
        <tr>
            <td>{e.title}</td>
            <td><input className='checking' type="checkbox" checked={e.favorite == null ? false : e.favorite} readOnly={true}></input></td>
            <td>{e.watchDate == null ? false : e.watchDate.format("YYYY-MM-DD")}</td>
            <td>{e.rating}</td>
            {/* <td>
          <Button variant="primary" className="m-1" onClick={props.increaseScore}>Vote</Button>
          <Button variant="danger" className="m-1" onClick={props.deleteRow}>Delete</Button>
        </td> */}
        </tr>
    );
}

export default MyRow;