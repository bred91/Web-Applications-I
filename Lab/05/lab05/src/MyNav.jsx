import { Nav } from 'react-bootstrap';


function MyNav(props) {
    return (
        // Navbar
        <Nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top navbar-padding">

            {/* Sidebar toggle button */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#left-sidebar"
                aria-controls="left-sidebar" aria-expanded="false" aria-label="Toggle sidebar">
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Logo and title */}
            <a className="navbar-brand" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" fill="currentColor" className="bi bi-camera-reels-fill" viewBox="0 0 16 16">
                    <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path d="M9 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                    <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7z" />
                </svg>
                Film Library
            </a>

            {/* Search form */}
            <form className="form-inline my-2 my-lg-0 mx-auto d-none d-md-block" action="#" role="search" aria-label="Quick search">
                <input className="form-control me-auto" type="search" placeholder="Search" aria-label="Search query"></input>
            </form>

            {/* Link to the user profile */}
            <div className="navbar-nav ms-md-auto">
                <a className="nav-item nav-link" href="#">
                    <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
                        <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
        </Nav>
    );
}

export default MyNav;