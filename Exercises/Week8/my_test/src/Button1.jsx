import{useState} from 'react';

function Button1(props) {
    const [buttonLang, setButtonLang] = useState(props.lango);

    const but = () => {
      setButtonLang( e => !e);
    }

    return (
      // onClick={()=>setEnglish((eng)=>(!eng))
      <button onClick={but}>
        {buttonLang ? 'English' : 'Italian'}
      </button>
    );
  }

  export default Button1;