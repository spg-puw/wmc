# Advanced Webserver

Hier werden u.a. folgende Konzepte vorgestellt:

* Konfiguration über `.env` Datei
* Template Engine pug (Ordner `views`)
* Routen auf mehrere Dateien aufteilen (Ordner `routes`)
* Middleware
  * morgan: logging (Logzeilen, wenn Seite aufgerufen wird)
  * static files
  * serve index (Webseite wenn man `/public` aufruft)
  * serve favicon
* OpenAPI Dokumentation (bei den Routen, aufrufbar unter `/doc`)

## Setup

* Downloaden
* `.env` erzeugen: `cp .env.sample .env`
* `npm install`
* `node index.js` oder `npm run dev` oder `node ./node_modules/nodemon/bin/nodemon.js index.js`