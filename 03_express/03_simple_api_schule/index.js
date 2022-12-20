const express = require('express');
const app = express();
const port = 3000;

//middleware: serve static files from folder public
app.use("/", express.static("public"));

const s = require('./Schulen.json');

app.get('/a1', (req, res) => {
    // alle Schulen (Name, Adr, PLZ Ort) mit PLZ > 4000
    let r = s
        .filter(e => e.plz > 4000)
        .map((e) => ({ schulname: e.schulname, adr: e.strasse, plz: e.plz, ort: e.ort }))
    res.json(r);
})

app.get('/a2', (req, res) => {
    // alle Schulen (Name, Adr, PLZ Ort) in Wien
    let r = s
        .filter(e => e.bundesland == "Wien")
        .map((e) => ({ schulname: e.schulname, adr: e.strasse, plz: e.plz, ort: e.ort }))
    res.json(r);
})

app.get('/a3', (req, res) => {
    // alle Schulen (Name, Adr, PLZ Ort) in Wien, bei der die Adresse „gasse“ enthält
    let r = s
        .filter(e => e.bundesland == "Wien")
        .filter(e => e.strasse.includes("gasse"))
        .map((e) => ({ schulname: e.schulname, adr: e.strasse, plz: e.plz, ort: e.ort }))
    res.json(r);
})

//TODO: weitere Aufgaben

app.listen(port, () => {
    console.log(`Webserver gestartet: http://localhost:${port}`);
    console.log(`Zum Beenden: Ctrl+C`);
})
