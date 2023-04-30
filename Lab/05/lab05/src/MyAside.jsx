

function MyAside(props) {

    return (
        // Left sidebar
        <aside className="collapse col-12 d-md-block col-md-3 bg-light below-nav" id="left-sidebar">
            <div className="list-group list-group-flush" role="group">
                <a href="#" id="filter-all" className="list-group-item list-group-item-action myActive" aria-pressed="true" onClick={() => props.choose(0)}>All</a>
                <a href="#" id="filter-favorites" className="list-group-item list-group-item-action myActive" onClick={() => props.choose(1)}>Favorites</a>
                <a href="#" id="filter-best" className="list-group-item list-group-item-action myActive" onClick={() => props.choose(2)}>Best Rated</a>
                <a href="#" id="filter-seen-last-month" className="list-group-item list-group-item-action myActive" onClick={() => props.choose(3)}>Seen Last Month</a>
                <a href="#" id="filter-unseen" className="list-group-item list-group-item-action myActive" onClick={() => props.choose(4)}>Unseen</a>
            </div>
        </aside>
    );
}

export default MyAside;