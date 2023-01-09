# Mini API mit DB

## Informationen

Hier werden neue Konzepte für kleine APIs vorgestellt, für größere Projekte lohnt sich sicher ein Blick auf [Loopback](https://loopback.io/) inkl. TypeScript.

* Middleware
  * `lib/customLoggingMiddleware`: gibt eine kurze Information aus wenn ein neuer request empfangen wird
  * `lib/errorHandlerMiddleware`: eigener Errorhandler, der 401 und 500 Status-Codes behandelt
  * `lib/rateLimitMiddleware`: beschränkt die Anzahl der Zugriffe auf die API
  * `lib/authMiddleware`: behandelt JWT-Tokens (Auth-Header oder _jwt Query-Parameter), die Middleware schützt Endpunkte durch `guard(...)` (siehe Routen)
* JWT (JSON Web Token): Ein Grundprinzip von REST Webservices ist die Zustandslosigkeit, eine Anfrage sollte alle Informationen für den Server beinhalten - auch "Logindaten" für gesicherte Endpunkte; da man bei APIs ungerne die ganzen Logindaten sendet, setzt man häufig auf Tokens o.ä.; in JWT kann man eine beliebige Payload übermitteln (in unserem Fall userId und permissions), das Token ist vom Server signiert und kann bspw. auch für mehrere APIs verwendet werden (siehe Microservices); Meistens wird das Token mit dem HTTP-Header `Authorization: Bearer hier_kommt_das_JWT_Token_hin` übermittelt
  * die Token werden über die `/auth` Endpunkte erzeugt
  * gesicherte Endpunkte brauchen ein Token über den Header `Authorization` oder die Query-Parameter `_jwt=`
  * der Inhalt eines JWT kann bspw. auf folgender Webseite dekodiert werden: [JWT Debugger](https://jwt.io/)
* Login mit Passwort
  * für die News-API gibt es Logins mit Passwort (z.B. `user1` mit Passwort `user1`)
  * Passwörter sollten NIEMALS im Klartext gespeichert werden
  * eine einfache Möglichkeit Passwörter sicher zu speichern ist hashing; hier wird das Passwort mit einer Hash-Funktion wie md5, sha256 etc. umgewandelt. Ziel ist, dass man von den Ausgabedaten der Hash-Funktion nicht auf die Eingabedaten, also das Passwort im Klartext, zurückschlißen kann. Die Hash-Funktion kann nur sehr schwer "zurückgewandelt" werden (siehe bspw. rainbow tables). Um Rückschlüsse für häufige Passwörter noch schwerer zu machen, wird auf ein sog. salt eingesetzt, das sollte man selbst zufällig auswählen
  * um anzuzeigen, welche Hash-Funktion verwendet wird, kann man bspw. auf ein Prefix setzen; in unserem Fall wird SHA512 verwendet, womit sich ein Prefix von `$6$` bei den gehashten Passwörtern ergibt
  * die Hash-Funktion findet sich in `lib/helpers.js`
* Datenbank
  * die `/auth` und `/news` Routen verwenden Datenbanken (hier SQLite3)
  * die Daten werden also in einer Datei (`production.sqlite3` oder `development.sqlite3`) gespeichert
  * man kann die Datenbank ganz einfach mit Zusatzsoftware (DBeaveer oder DB Browser for SQLite) öffnen und sich alle Tabellen etc. ansehen
  * Achtung: SQLite hat einige Einschränkungen (siehe [SQLite](https://www.sqlite.org/about.html))
  * die Datenbank wird von nodejs automatisch erzeugt und geseedet (mit Werten befüllt), wenn man dan Server erstmalig startet
  * man kann auch ganz einfach den eigenen DB-Server verwenden, die verwendete Library unterstützt die gängisten DB-Systeme wie MS-SQL, MySQL/MariaDB, etc.; hier empfehlen sich XAMPP (MariaDB) oder ein eigener Docker-Container (Einstellungen in `db/config.json`)
  * Die DB-Library [Sequelize](https://sequelize.org/) ist ein ORM (Object Relational Mapper), ist damit in der Verwendung ähnlich zu EFCore bei C# etc.; die Tabellen sind JS-Objekte/Klassen und man muss idR keine SQL-Queries manuell schreiben<br />
  Alternativen: [Knex Query Builder](https://knexjs.org/guide/query-builder.html), [Loopback](https://loopback.io/)
  * Achtung: die Datenbank wurde mittels Code-First Ansatz geschrieben und alles in der Datei `db/index.js` untergebracht; bei größeren Projekten würde man die einzelnen Models (Tabellen) auf mehrere Dateien aufteilen und das CLI von Sequelize verwenden!
* OpenAPI
  * die Endpunkte sind via OpenAPI dokumentiert; siehe `/doc`
  * bei gesicherten Endpunkten (siehe Schloss, rechte Seite beim Pfeil) muss man zuerst das entsprechende Token eintragen (und vorher natürlich generieren)
* Docker: es kann ein Docker image erzeugt werden (siehe unten)
* Babel: es können ältere NodeJS Versionen unterstützt werden
  
## Setup

* Downloaden
* `.env` erzeugen: `cp .env.sample .env`
* ENV-Settings anpassen
* `npm install`
* `node index.js` oder `npm run dev` oder `node ./node_modules/nodemon/bin/nodemon.js index.js`
* Die Datenbank befindet sich in `db/*.sqlite3`

### Setup mit Babel

Babel wird verwendet, um neue JS Sprachfunktionen (z.B. `??`) auch in älteren Versionen von NodeJS (z.B. v12) auszuführen - Babel übersetzt dann den 'neuen' Code.

Warum ist das nötig?

* manchmal gibt es auf den Hostsystemen nur eine bestimmte/veraltete Version von node im Paketmanager<br />
Abhilfe schafft hier bspw. das npm Paket `n`, damit können verschiedene node Versionen installiert und verwaltet werden
* nur eine bestimmte Version von node ist getestet, erfüllt Kundenanforderungen etc.

Moderner JS Code (mit neuen Sprachelementen) kann mit babel umgewandelt werden, das Ergebnis ist nach `npm run build` im Ordner `dist/` sichtbar, alternativ kann auch mit `npm run dev-babel` der Code direkt ausgeführt werden.

### Setup mit Docker

Docker ist eine Software, die es erlaubt Anwendungen in sog. Containern zu virtualisieren. Es benötigt wesentlich weniger Ressourcen im Vergleich zu einer 'normalen' Virtualisierungumgebung (bspw. VirtualBox). Mit Docker können alle Abhängigkeiten der Software, in unserem Fall also z.B. die node Laufzeitumgebung, in der passenden Version installiert, getestet und auch reproduzierbar ausgerollt werden.

Mit folgenden Kommandos wird Docker image erzeugt und gestartet:

```sh
docker build -t 05_api_db .
docker run -it --rm --name nameDesContainers -p 127.0.0.1:4000:4000 05_api_db
(hier folgt die Ausgabe vom Docker container)
(man kommt mit Ctrl+p und Ctrl+q wieder heraus)
```

Die Anwendung sollte nun unter http://localhost:4000/ erreichbar sein.

Einige Hinweise:

* auf Linux-Servern, die mit einer Firewall geschützt (z.B. ufw, iptables, nftables, pf) sind, ist es wichtig `-p 127.0.0.1:4000:4000` anzugeben, denn die Firewallregeln wirken nicht!
* erzeugte Docker images benötigen im Vergleich zu unserem Code sehr viel Speicherplatz, es ist daher sinnvoll, nicht mehr benötigte images von Zeit zu Zeit zu löschen

```sh
docker image ls
REPOSITORY                             TAG              IMAGE ID       CREATED          SIZE
05_api_db                              latest           ac420ad2984f   12 seconds ago   314MB

docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS                 PORTS
9f5ce3ad846f   05_api_db   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes           127.0.0.1:4000->4000/tcp

docker container stop nameDesContainers
(dieser wird automatisch gelöscht, weil --rm bei docker run gesetzt war)

docker image rm 05_api_db
```

## Aufgaben

* erweitere die Datenbank um eine weitere Tabelle für Kategorien (`categories`) für Newsartikel
  * Kategorien haben eine Id und Kateogoriename
  * Ein Artikel kann einer Kategorie angehören, eine Kategorie kann mehrere Artikel haben
* schreibe/ändere Endpoints
  * NEU: Kategorien anzeigen (inkl. Artikel) + OpenAPI Doku
  * NEU: alle Artikel in Kategorie anzeigen
  * NEU: Kategorie anlegen + OpenAPI Doku
  * MOD: füge die Kategorien bei allen Endpunkten ein, wo Artikel zurückgegeben werden (nutze `includes: { ... }` vom ORM)