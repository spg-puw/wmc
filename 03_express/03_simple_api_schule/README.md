# Simple Schul-API

## Setup

* `npm install`
* nodemon
  * bei globaler Installation: `nodemon index.js`
  * sonst `node ./node_modules/nodemon/bin/nodemon.js index.js`

## Aufgabe

Schreiben Sie eine API, die die Daten aus `Schulen.json` verarbeitet und folgende Endpoints anbietet:

* `GET /a1`: alle Schulen (Name, Adr, PLZ Ort) mit PLZ > 4000
* `GET /a2`: alle Schulen (Name, Adr, PLZ Ort) in Wien
* `GET /a3`: alle Schulen (Name, Adr, PLZ Ort) in Wien, bei der die Adresse „gasse“ enthält
* `GET /a4`: alle Schulen (Name, Adr, PLZ Ort) in Wien und Tirol
* `GET /a5`: Mailadresse aller Schulen in NÖ
* `GET /a6`: alle Schulen (Name) mit Informatik-Ausbildung
* `GET /a7`: Webseite aller Schulen mit Informatik-Ausbildung in Wien
* `GET /a8`: Webseite aller Schulen mit Informatik-Ausbildung in Wien im HTML-Format mit bullet points, damit man das Code snippet auf einer Webseite einfügen könnte
* `GET /a9`: alle Ausbildungen der Spengergasse (Name, Dauer, conditions, note)
* `GET /a10`: alle Ausbildungen aller Wiener Schulen (Name, Dauer)
* `GET /a11`: alle Schulen (Name, Adr, PLZ Ort) im (Quadrat-)Um“kreis“ der Spengergasse mit +- 10km (10km in GPS-Distanz für lan/lot umwandeln)
* `GET /a12`: alle Ausbildungen (Name, Dauer) im Umkreis (wie vorhin) der Spengergasse +- 10km
* `GET /a13`: alle Ausbildungen (Name, Dauer) OHNE die der Spengergasse im Umkreis (wie vorhin) der Spengergasse +- 10km
* `GET /a14`: alle Ausbildungen (Name, Dauer) in Wien OHNE die der 2 größten Schulen (TGM, Spengergasse)
