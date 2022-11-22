const express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/quadrat', (req, res) => {
  const zahl = req.query?.zahl;
  const r = { "success": false, "message": "default", "result": null };
  if (Number.isFinite(Number(zahl))) {
    if (zahl <= 1000) {
      r.result = zahl ** 2;
      r.message = "Berechnung erfolgreich durchgeführt";
      r.success = true;
    }
    else {
      r.message = "Zahl zu groß! Bitte wählen Sie eine Zahl <= 1000";
    }
  }
  else {
    r.message = "Bitte geben Sie eine gültige Zahl für den Paramter 'zahl' ein!"
  }
  res.json(r);
})

app.get('/geheim', (req, res) => {
  const geheimzahl = Math.floor(Math.random() * 100);
  if (geheimzahl == 42) {
    res.set('Secret-HTTP-Header', 'answer to the ultimate question of everything');
  }
  res.send(`Hier befindet sich eine geheime Information: ${geheimzahl}`);
})

app.get('/ausgabe', (req, res) => {
  res.send(`Diese Ausgabe erscheint am Client, also im Browser`);
  console.log(`Diese Ausgabe erscheint am Server, also dort wo node ausgeührt wird`);
})

app.get('/calc', (req, res) => {
  res.send(`NodeJS kann auf dem System wo es läuft auch Programm ausführen!`);
  console.log(`Jetzt wird der Rechner geöffnet ...`);
  if (process.platform == 'win32') {
    // Windows (normal)
    exec("calc.exe");
  }
  else if (process.platform == 'linux' && fs.readFileSync('/proc/version').toString().includes('microsoft')) {
    // Windows + WSL
    console.log(`Du führst Node anscheinend über WSL aus ...`);
    exec("calc.exe");
  }
  else if (process.platform == 'cygwin') {
    // Windows + Cygwin
    //TODO: ungetestet
    console.log(`Du führst Node anscheinend über Cygwin aus ...`);
    exec("calc.exe");
  }
  else if (process.platform == 'darwin') {
    // MacOS
    exec(`$(mdfind kMDItemCFBundleIdentifier = "com.apple.calculator")/Contents/MacOS/Calculator`);
  }
  else {
    console.log(`Leider finde ich keinen Rechner bei dir ...`);
  }
})

app.listen(port, () => {
  console.log(`Webserver gestartet: http://localhost:${port}`);
  console.log(`Zum Beenden: Ctrl+C`);
})
