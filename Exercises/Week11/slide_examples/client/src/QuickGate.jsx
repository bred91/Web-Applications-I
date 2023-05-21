import {useEffect, useState} from "react";

function QuickGate(props) {
    const [open, setOpen] = useState(false) ;

    useEffect(()=>{
        // set a timer to close the gate after 1 second
        setTimeout(()=>setOpen(false), 1000)
    }, 
    [open] // the effect runs when the value of open changes
    ) ;

    const openMe = () => {
        setOpen(true) ;
    } ;

    return <div onClick={openMe}>
        {open ? <span>GO</span> : <span>STOP</span>}
    </div> ;
}

export default QuickGate ;