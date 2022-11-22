import chalk from "chalk";

// chalk liegt nur als ES-Modul vor, daher müssen wir es statt mit require(...) über import einbinden
// außerdem muss die Datei ein *.mjs sein, um den Code direkt ausführen zu können

function greet(name) {
    return `Hello ${name}!`;
};

console.log("Farbe mit chalk:");
console.log(chalk.red(greet("John Doe")));
console.log(chalk.yellow(greet("John Doe")));
console.log(chalk.green(greet("John Doe")));
console.log(chalk.bgRed(greet("Jane Doe")));
console.log(chalk.bgYellow(greet("Jane Doe")));
console.log(chalk.bgGreen(greet("Jane Doe")));