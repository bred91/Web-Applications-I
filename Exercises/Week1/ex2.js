"use strict";

const userNames = `Luigi De Russis, Luca Mannella,   Fulvio Corno, 
Juan Pablo   Saenz   Moreno, 
Enrico Masala, Antonio  Servetti,  Eros Fani `;

// Professors solution
const modif = userNames;

const names = modif.split(',');

/* does not work: n is a copy of the value, not the value in the array
for (let n of names)
    n = n.trim();
*/

// clean whitespace around commas
for (let i = 0; i < names.length; i++) {
    names[i] = names[i].trim();
}
console.log(names);

// compute acronyms
const acronyms = [];
for (const name of names) {
    const words = name.split(' ') ;
    //console.log(words) ;
    let initials = '' ;
    for(const word of words) {
        if (word) {
            initials = initials + word[0] ;
        }
    }
    acronyms.push(initials) ;
}

console.log(acronyms);


// My solution
const userNamesArray = userNames.split(",").map((name) => name.trim());

console.log(userNamesArray);

const acronymsNames = userNamesArray.map((name) => {
    const nameArray = name.split(" ");
    const acronym = nameArray.map((name) => name[0]).join("");
    return acronym;
});

console.log(acronymsNames.sort());