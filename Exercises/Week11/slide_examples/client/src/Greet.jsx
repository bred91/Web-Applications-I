import {useEffect} from "react";

function GreetBAD(props) {
    const message = `Hello, ${props.name}!`; // Calculates output

    // Bad!
    console.log(`Greetings: ${message}`); // Side-effect!   <- it runs everytime the component renders
    return <div>{message}</div>;       // Calculates output
}

function Greet(props) {
    const message = `Hello, ${props.name}!`; // Calculates output

    useEffect(() => {
        // Good!
        console.log(`Greetings: ${message}`); // Side-effect!
    }, 
    []  // Run ONCE after the first render
    );
    return <div>{message}</div>;       // Calculates output
}

export {Greet, GreetBAD};