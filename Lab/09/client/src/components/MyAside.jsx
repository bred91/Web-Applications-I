import { ListGroup } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

const MyAside = (props) => {
    const { items, selected } = props;

    // Converting the object into an array to use map method
    const filterArray = Object.entries(items);

    return (
        // Left sidebar
        <ListGroup as="ul" variant="flush">
            {
                filterArray.map(([filterName, { label, url }]) => {
                    return (
                        <NavLink className="list-group-item" key={filterName} to={url} style={{ textDecoration: 'none' }}>
                            {label}
                        </NavLink>
                    );
                })
            }
        </ListGroup>
    );
}

export default MyAside;