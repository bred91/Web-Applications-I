import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Container, Nav, Navbar, Form } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import API from '../API';
import { toast } from 'react-toastify';


function MyNav(props) {
    const [siteName, setSiteName] = useState('');               // site name    
    const [editSiteName, setEditSiteName] = useState(false);    // flag for editing site name
    const [dirtySiteName, setdirtySiteName] = useState(true);

    const name = props.user && props.user.name;
    const isAdmin = props.user && props.user.isAdmin;

    const navigate = useNavigate();

    useEffect(() => {
        if (dirtySiteName) {
            API.getSiteName()
                .then((name) => {
                    setSiteName(name);
                    setdirtySiteName(false);
                })
                .catch((err) => {
                    handleErrors(err);
                    setdirtySiteName(false);
                });
        }
    }, [dirtySiteName]);

    const handleErrors = (err) => {
        if (err.response && err.response.data) {
            toast.error(err.response.data.message)
        } else {
            toast.error(err);
        }
    }

    const handleName = (v) => {
        setEditSiteName(v); 
    }

    const handleCancel = () => {
        handleName(false)
        setdirtySiteName(true)
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();

        if (siteName === '') {
            toast.error('Site name cannot be empty', { autoClose: 2000 });
            return;
        }

        setEditSiteName(false);
        setSiteName(siteName);

        API.changeSiteName(siteName)
            .then(() => {
                toast.success('Site name changed successfully', { autoClose: 2000 });
                setdirtySiteName(true)
            })
            .catch(err => handleErrors(err));
    }

    const handleLogout = () => {
        props.logout();
        navigate('/');
    }

    return (
        <Navbar bg="dark" expand="sm" variant="dark" fixed="top" className="navbar-padding">
            <Container>
                {isAdmin && editSiteName ? <Form onSubmit={handleSubmit}>
                    <Form.Control type='text' value={siteName} onChange={ev => setSiteName(ev.target.value)} />
                </Form> :
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Navbar.Brand>
                            <i className="bi bi-file-image-fill pl-3-play icon-size" /> {siteName}
                        </Navbar.Brand>
                    </Link>}
                {dirtySiteName && isAdmin ? <Navbar.Brand><i className="bi bi-exclamation-circle-fill text-warning" /></Navbar.Brand> : null}
                {isAdmin ?
                    !editSiteName ?
                        <Button className='bi bi-pencil btn-sm' variant='warning' onClick={() => handleName(true)}></Button>
                        : <>
                            <Button className="mx-3 btn-sm" variant='success' onClick={handleSubmit}>Save</Button>
                            <Button className="btn-sm" variant='warning' onClick={handleCancel}>Cancel</Button>
                        </>
                    : null}
                <Nav id='centralNav' className="my-2 my-lg-0 mx-auto d-sm-block">
                    {name ?
                        <>
                            <NavLink to="/" className='mx-3 link-personal p-1 rounded'>Front Office</NavLink>
                            <NavLink to="/backoffice" className='mx-3 link-personal p-1 rounded'>Back Office</NavLink>
                        </>
                        : null
                    }
                </Nav>
                <Nav className="ml-md-auto">
                    <Nav.Item >
                        {name ? <>
                            <Navbar.Text className='fs-5 mx-3'>
                                {isAdmin ? "Signed in as: " + name +  " (Admin)" : "Signed in as: " + name +  " (User)"}
                            </Navbar.Text>
                            <Button variant='danger' onClick={handleLogout}>Logout</Button>
                        </> :
                            <Button variant='warning' onClick={() => navigate('/login')}>Login</Button>}
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default MyNav;