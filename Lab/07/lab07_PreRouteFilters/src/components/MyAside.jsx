import { ListGroup } from "react-bootstrap";


function MyAside(props) {
    return (
        // Left sidebar
        <ListGroup className="col-md-3 bg-light below-nav">
            <ListGroup.Item as="li" action href="#filter-all" variant="secondary"
                onClick={() => props.choose(0)} active={props.selected === 0 ? true : false}>All</ListGroup.Item>
            <ListGroup.Item as="li" action href="#filter-favorites" variant="secondary"
                onClick={() => props.choose(1)} active={props.selected === 1 ? true : false}>Favorites</ListGroup.Item>
            <ListGroup.Item as="li" action href="#filter-best" variant="secondary"
                onClick={() => props.choose(2)} active={props.selected === 2 ? true : false}>Best Rated</ListGroup.Item>
            <ListGroup.Item as="li" action href="#filter-seen-last-month" variant="secondary"
                onClick={() => props.choose(3)} active={props.selected === 3 ? true : false}>Seen Last Month</ListGroup.Item>
            <ListGroup.Item as="li" action href="#filter-unseen" variant="secondary"
                onClick={() => props.choose(4)} active={props.selected === 4 ? true : false}>Unseen</ListGroup.Item>
        </ListGroup>
    );
}

export default MyAside;