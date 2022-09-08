let b = [1,2,3]
let a = [[b]]; 
console.log(a); // will output [[1,2,3]]
console.log(...a[0][0]); // will output 1,2,3 individually through spread operator

// A function that takes an array as an argument and logs each element of the array through spread operator
const x = (a) => {
    console.log(...a[0][0]);
}

x(a); // output  1 ,2 and 3 individually

//--------------------------------------------------------------//

let c  = [[[1,2,3]]] 
console.log(c[0][0].length);

for (let i = 0; i < c[0][0].length; i++) {
    console.log(c[0][0][i]);
}

const y = (c) => {
    // output me 1 ,2 and 3 individually
    c[0][0].map(element => {
        console.log(element)
    });
}

y(c);   