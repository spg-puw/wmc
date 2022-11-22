# Express

Express ist ein NodeJS Framework für Webapplikationen, welches sehr erweiterbar ist.

> Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.<br>
> (siehe http://expressjs.com/)

## Installation

Express kann via NPM als Paket installiert werden:

```sh
npm install express
```

Als [Beispiel](http://expressjs.com/en/starter/hello-world.html) kann ein einfacher Webserver mit ein paar Zeilen Code programmiert werden:

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

Der Webserver kann nach dem Start unter http://localhost:3000/ aufgerufen werden. Das Beispiel befindet sich in diesem Repository im Ordner `01_simple_webserver`. Der Webserver antwortet mit `Hello World!` bzw. einem 404 Fehler (`Cannot GET /test123`), wenn eine andere Seite aufgerufen wird.

## Routing

Mit dem "Routing" gibt man dem Webserver die Information, welcher Programmcode bei einem bestimmten HTTP-Befehl ausfeführt werden soll. Express erlaubt eine flexible Konfiguration in diesem Bereich, womit recht einfach zusätzliche "Plugins" als Middleware (siehe weiter unten) für bestimmte Aufgaben einfach eingebunden werden können.

Man kann sich Routing als Regelwerk vorstellen, die dem Express-Server sagt, welche Funktion bei welchem HTTP-Aufruf ausgeführt werden soll:

```
GET   /                     -> function seiteIndex(req, res) { ... }
GET   /assets/katze.jpg     -> static middleware
POST  /api/login            -> function apiLogin(req, res) { ... }
POST  /neuerbeitrag         -> function handlerFuerNeuenBeitrag(req, res) { ... }
PATCH /api/produkt          -> function apiProductUpdate(req, res) { ... }
  ^        ^                              ^
  |        |                              `----- Handler / Callback-Funktion
  |        `------------------------------------ Pfad; z.B. bei GET/POST das was in der Browseradresszeile nach dem Servernamen steht
  `--------------------------------------------- HTTP-Verb
```

Ein herkömmlicher Webserver wie Apache oder nginx bildet üblicherweise das Dateisystem mit dem Pfad ab; wird beispielsweise http://localhost:3000/ordner1/datei1.txt aufgerufen, so wird üblicherweise die Datei `datei1.txt` im Ordner `ordner1` im Hauptverzeichnis der Web**server**dateien (Konfigurationsabhängig) gesucht. Dieses Verhalten kann man natürlich auch in Express nachbilden (siehe static-Middleware weiter unten). Für unsere Anwendungszwecke werden wir die Routen für API-Endpoints meistens selbstständig konfigurieren.

Die Routenkonfiguration, also welcher Inhalt bei einer Adresse ausgegeben wird, erfolgt nach folgendem Prinzip (anhand des Codebeispieles oben):

```text
app.METHOD(PATH, HANDLER)
 ^     ^     ^      ^
 |     |     |      `------ Callback Funktion, die ausgeführt wird, wenn die Route aufgerufen wird
 |     |     `------------- Pfad (String, RegEx), der das HTTP-Ziel angibt, kann auch Parameter enthalten
 |     `------------------- HTTP-Verb (GET, PUT, POST, DELETE, ...)
 `------------------------- Name der Express-Instanz
 ```

Der Handler (Callback Funktion) erhält 2 Argumente (request und response) und ist typischerweise eine Arrow-Function (`=>`). Natürlich kann die Callback Funktion auch extra definiert und benannt werden, in der Praxis spart man sich diesen Schritt meistens bzw. übergibt den Webrequest einer eigenen Service-Schicht, die dann die Business-Logik vom Projekt übernimmt.

* Im request (üblicherweise `req`) Objekt befinden sich Informationen zum Aufruf (HTTP-Header vom Browser, Verschlüsselung etc.)
* Im response (üblicherweise `res`) Objekt können wir Express sagen, wie mit diesem Aufruf zu verfahren ist (Text senden, JSON senden, eigene Header setzen etc.)

Ein POST-Handler würde beispielsweise so aussehen:

```javascript
app.post('/', (req, res) => {
  res.send('This is a POST request.')
})
```

## Middleware

Express kann beliebig erweitert werden, typischerweise wird dazu sog. Middleware eingesetzt. Eine Middleware schaltet sich, wie der Name vermuten lässt, zwischen Requestbearbeitung und der Antwort durch unseren Handler (z.B. `app.get(...)`).

Ein Webrequest kann mehrere Middleware Schritte durchlaufen, bis sie zum eigentlichen Handler kommt oder in manchen Fällen (z.B. Prüfung ob User eingeloggt ist schlägt fehl) durch eine Middleware abgefangen wird.

**Beispiel für eine Middlewarekonfiguration**:
```
Express-Webrequest
    `-> Cookie-Middleware: liest den Cookie-Header und speichert den Inhalt in req.cookies
        `-> Logincheck-Middleware: prüft ob Pfad mit /api/ beginnt und User eingeloggt ist (z.B. Cookie)
            `-> static files Middleware: prüft ob Pfad mit /assets/, sucht Datei und sendet diese Zurück
                `-> (weitere Middleware)
                    `-> Handler: führt die Logik aus
```

Die Middleware kann mit dem Request alles machen, sie kann dem Benutzer auch statt unserem Handler antworten, so dass unser Handler gar nicht aufgerufen wird - dies ist beim Debuggen von Applikationen zu berücksichtigen. Man sollte sich daher bei Express-Applikationen zu Beginn einen Überblick über die verwendete Middleware und die Routes verschaffen, um zu verstehen, wie der Server Anfragen bearbeitet.

Ein typisches Szenario, wo wir eine Middleware einsetzen wollen, die einen Aufruf des eigenen Handlers verhindert, ist wenn wir verhindern wollen, dass ein User ohne Login gewisse Informationen abrufen kann. Unser Handler lagert die Prüfung an die Middleware aus und unberechtigte Anfragen werden z.B. mit einem HTTP 401 Unauthorized abgewiesen.

Ergänzend zum obigen Beispiel (Routing) würde sich unsere beispielhafte Middlewarekonfiguration folgendermaßen verhalten:

```
GET   /                     -> durchläuft jede Middleware und landet beim Handler für die Hauptseite
GET   /assets/katze.jpg     -> durchläuft die Middlewares bis zur static files Middleware;
                               es wird nach der Datei am Dateisystem des Express-Servers gesucht und
                               an den Browser gesendet
POST  /neuerbeitrag         -> durchläuft cookie und logincheck Middleware
                               Wenn der User eingeloggt ist, werden weitere Middlewares durchlaufen
                               und der request an den Handler übergeben, der z.B. einen neuen Beitrag
                               in der Datenbank abspeichert
                               Wenn der User nicht eingeloggt ist, bricht die logincheck Middleware
                               die Verarbeitung ab und schickt eine Fehlermeldung, dass man nicht
                               eingeloggt ist
```


Eine Middleware wird in Express generell wie folgt eingebunden:

```javascript
app.use(...);
```

als Beispiel dient die "static" Middleware von Express, hier kann das Verhalten eines normalen Webservers, also Dateien auszuliefern, in unserer Software nachprogrammiert werden. Im folgenden Beispiel werden vorhandene Dateien im Ordner `public` und `images` aufgerufen, wenn der Name mit der Route (path) übereinstimmt. Werden Dateien in der Route `/cat` angefragt, beispielsweise `/cat/cat1.jpg`, so wird im Ordner `catpictures` danach gesucht.

Kommt eine Datei mehrmals vor, so nimmt Express den ersten Eintrag, der gefunden wird - hier beispielsweise `public`, dann `images`, dann `catpictures`.

```javascript
const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'public'))); // Absolutpfad
app.use(express.static('images')); // relativ zum node Arbeitsverzeichnis
app.use('/cat', express.static('catpictures')); // route Prefix
```

*Anmerkung*: Der Pfad von `express.static(...)` ist relativ vom Arbeitsverzeichnis von node, also dem Verzeichnis von wo das node Programm aufgerufen wird.

Eine Middleware kann auch leicht selber programmiert werden - beachte, dass `next` explizit aufgerufen werden muss:

```javascript
// Middleware NUR für api Routen (/api)
// es wird ein Spezialheader bei der Antwort an den Client (Browser) hinzugefügt
app.use('/api', function(req, res, next){
    res.set('API-Header', 'wichtiger Header für die API Clients'); // eigener Code

    next(); // ruft die nächste Middleware auf
});

// Middleware zum Mitloggen
// die Middleware schreibt bei einem Aufruf einfach logging something in die Konsole
const simpleLogger = function (req, res, next) {
    console.log(`logging something`);

    next();
}
// im Vergleich zu oben, wird diese Middleware bei ALLEN requests ausgeführt
app.use(simpleLogger);

// Middleware zum Mitloggen mit Prefix
// die Middleware schreibt bei einem Aufruf logging something mit einem Prefix in die Konsole
const advancedLogger = function(loggerPrefix) {
    return function (req, res, next) {
        console.log(`${loggerPrefix}: logging something`);

        next();
    }
}
app.use(advancedLogger('myprefix'));
```

Weitere nützliche Express-Middleware kann leicht im Internet gefunden werden, die folgende Liste soll einige Anregungen geben:

* [body-parser](https://www.npmjs.com/package/body-parser)
* [compression](https://www.npmjs.com/package/compression)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [cookie-session](https://www.npmjs.com/package/cookie-session)
* [cors](https://www.npmjs.com/package/cors)
* [express-session](https://www.npmjs.com/package/express-session)
* [helmet](https://www.npmjs.com/package/helmet)
* [method-override](https://www.npmjs.com/package/method-override)
* [morgan](https://www.npmjs.com/package/morgan)
* [serve-favicon](https://www.npmjs.com/package/serve-favicon)
* [serve-index](https://www.npmjs.com/package/serve-index)

## Template Engines

**TODO**: Dieser Abschnitt wird noch ergänzt.

Mehr dazu unter: http://expressjs.com/en/guide/using-template-engines.html

## Errorhandler

Guter Code sollte entsprechende Fehlerbehandlung vorsehen. In Express ist ein Standarderrorhandler bereits integriert, es ist aber in vielen Fäller nützlich ensprechende Anpassungen an die eigenen Bedürfnisse vorzunehmen.

Mehr dazu unter: http://expressjs.com/en/guide/error-handling.html

## Proxy

Es ist sehr beliebt Express-Applikationen beispielsweise als Microservice als Docker-Container zur Verfügung zu stellen. In der Regel ist die Applikation dann beispielsweise über localhost oder die Docker Container IP auf einem bestimmten Port ansprechbar. Um den Service in einen Webserver zu "integrieren" bieten sich sog. reverse proxies an.

Reverse Proxies leiten Anfragen (von einem Client idR außerhalb des Netzwerks) transparent an den Dienst weiter. Der Client bekommt von außen üblicherweise nichts davon mit. Ein reverse proxy ist damit Vergleichbar zu "NAT" aus der Netzwerktechnik.

Der wesentliche Vorteil liegt vor allem in der flexiblen Architektur, es gibt einen zentralen Server, der die Anfragen an die Subservices weiterreicht.

Express-Applikationen sollten für die Nutzung eines reverse proxy entsprechend konfiguriert werden, damit gewisse Informationen wie die originale IP-Adresse auch richtig verarbeitet werden können. Das geschiet technisch durch die zusätzlichen HTTP-Header `X-Forwarded-Host`, `X-Forwarded-Proto`, `X-Forwarded-For`.

Mehr dazu unter: http://expressjs.com/en/guide/behind-proxies.html

## Datenbanken

Datenbanken können einfach in Express integriert werden, denn viele Datenbanken werden von NodeJS durch zusätzliche Module unterstützt. Neben den klassichen RDBMS wie MSSQL, MySQL werden auch zahlreiche NoSQL-Datenbanken wie MongoDB unterstützt.

Es gibt auch Zahlreiche Frameworks, die für die Datenbanken ein ORM anbieten.

Ziel dieses Kurses sind nur simple Backends, daher werden Datenbanken hier nicht weiter beschrieben.

Mehr dazu (mit vielen Beispielen) unter: http://expressjs.com/en/guide/database-integration.html

## Debugging

Express Applikationen können bei komplexeren Applikationen etwas verwirrend sein, daher kann man die Debugging-Informationen mit der Umgebungsvariable `DEBUGGING` einfschalten. Falls requests lange dauern, kann mittels Debugging auch schnell ermittelt werden, welche Komponenten der Applikation besonder viel Zeit beanspruchen.

Das Programm wird dann wie folgt mit Debug-Informationen gestartet:
* Windows: `set DEBUG=express:* & node index.js`
* Linux und macOS: `DEBUG=express:* node index.js`

## Netzwerkverkehr mitprotokollieren

**TODO**: Dieser Abschnitt wird noch ergänzt.

* auf Dev-Computer
* auf remote server
* Probleme mit SSL und Lösungen
* SSL-Decryption am Client (Browser)