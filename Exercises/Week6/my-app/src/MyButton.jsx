import { Button } from 'react-bootstrap';
import { useState } from 'react';


function MyButton(props) {
    let [buttonlang, setButtonLang] = useState(props.lang);

    if(props.lang === 'it')
      return <Button variant='primary' onClick={() => setButtonLang('en')}>Ciao!</Button>
    else
      return <Button variant='primary' onClick={() => setButtonLang('it')}>Hello</Button>
}

export default MyButton;