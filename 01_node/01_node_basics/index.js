meinJsonObjekt = require('./jsonObjekt.json');

console.log(`Das erscheint in der Ausgabe!\n`);

let ergebnis1 = 2 * 4 + 2 ** 3;
console.log(`Das Ergebnis ist ${ergebnis1} bzw. man könnte das auch direkt brechnen: ${2 * 4 + 2 ** 3}\n`);

console.log(`Ausgabe direkt mit console.log(...):`);
console.log(meinJsonObjekt);
console.log(''); // leere Zeile

console.log(`Nur das Alter der Person: ${meinJsonObjekt.age}\n`); // auch zusätzlicher Zeilenumbruch mit \n

const { address: addressOnly, ...withoutAddress } = meinJsonObjekt;

console.log(`Nur die Personendaten ohne Adresse:`);
console.table(withoutAddress);

console.log(`\nNur die Adressdaten:`);
console.table(addressOnly);

console.group("\nGruppe");
console.log(`Eintrag 1`);
console.log(`Eintrag 2`);
console.log(`Eintrag 3`);
console.log(`Eintrag 4`);
console.groupEnd();

console.log(`wieder ein normaler Eintrag\n`);

function innen() {
    console.log(`das ist innen`);
    console.trace();
}

function aussen() {
    console.log(`das ist aussen`);
    innen();
}

console.log(`hilfreich beim debuggen`);
aussen();