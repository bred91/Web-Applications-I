import{useState} from 'react';

function Button1(props) {
    const [buttonLang, setButtonLang] = useState(props.lango);

    if(buttonLang === 'en') {
      return <button onClick={()=>setButtonLang('it')}>English</button>;
    }
    else
      return <button onClick={()=>setButtonLang('en')}>Italiano</button>;
  }

  export default Button1;