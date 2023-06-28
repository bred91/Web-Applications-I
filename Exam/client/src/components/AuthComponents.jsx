import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function LoginForm(props) {
  const [username, setUsername] = useState('luigi@test.com');
  const [password, setPassword] = useState('pwd');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(err => {
        // NB: Generic error message, should not give additional info (e.g., if user exists etc.)
        setErrorMessage('Wrong username and/or password');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    let error = '';
    if (username === '') {
      valid = false;
      error += '- Email is required\n';
    }
    if (password === '') {
      valid = false;
      error += '- Password required\n';
    }

    if (valid) {
      doLogIn(credentials);
    } else {
      setErrorMessage(error);
    }
  };

  return (
    <Container className='below-nav'>
      <Row>
        <Col xs={3}></Col>
        <Col xs={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
            {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>
              {errorMessage.split("-").map((e,index) => <Row key={index} className='justify-content-center'>{e}</Row>)}</Alert> : ''}
            <Form.Group controlId='username'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Button className='my-2' variant='success' type='submit'>Login</Button>
            <Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Cancel</Button>
          </Form>
        </Col>
        <Col xs={3}></Col>
      </Row>
    </Container>
  )
}

export { LoginForm };