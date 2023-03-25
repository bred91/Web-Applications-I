"use strinct";

const deleteAfterTimeout = (msg) => {
    console.log(msg);
    // do something
}

// runs after 2 seconds
setTimeout(deleteAfterTimeout, 2000, "Ciao!"); 