meinJsonObjekt = require('./jsonObjekt.json');

console.log(`Das erscheint in der Ausgabe!\n`);

let ergebnis1 = 2 * 4 + 2 ** 3;
console.log(`Das Ergebnis ist ${ergebnis1} bzw. man könnte das auch direkt brechnen: ${2 * 4 + 2 ** 3}\n`);

console.log(`Ausgabe direkt mit console.log(...):`);
console.log(meinJsonObjekt);
console.log('');

console.log(`Nur das Alter der Person: ${meinJsonObjekt.age}`);