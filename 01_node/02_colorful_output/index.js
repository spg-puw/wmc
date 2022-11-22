require("colors");
const chalk = require("chalk");

function greet(name) {
    return `Hello ${name}!`;
};

console.log("Farbe mit colors:");
console.log(greet("John Doe").red);
console.log(greet("John Doe").yellow);
console.log(greet("John Doe").green);
console.log(greet("Jane Doe").bgRed);
console.log(greet("Jane Doe").bgYellow);
console.log(greet("Jane Doe").bgGreen);