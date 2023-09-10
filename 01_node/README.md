# 1. Einführung in NodeJS

## Inhalt

- Grundbegriffe
- Was ist NodeJS
- Dateitypen
- Paketmanager npm
- Traditionelle Webentwicklung
- Moderne Webentwicklung: Frontend, Backend, APIs
- Unterschied clientseitiges und serverseitiges JS
- Demos

[zurück](../README.md)

## Grundbegriffe

Das Gebiet der Webentwicklung ist sehr breit - es existieren zahlreiche Programmiersprachen, Frameworks etc. Generell gibt es natürlich nicht *die* Programmiersprache oder ein ganz bestimmtes Framework für alle erdenklichen Anwendungszwecke. Welche Programmiersprache, welches Framework etc. sich für ein bestimmtes Projekt besonders eigenen ist sicherlich ein Thema von anderen Unterrichtsgegenständen und wird hier nicht weiter behandelt.

In WMC wird in diesem Kurs JavaScript sowie nodejs, express, jest, Vue, etc. verwendet.

Einige wichte Begriffe sollen daher an dieser Stelle erwähnt werden:

* Paketmanager / package manager: Softwarepakete aus Drittquellen können installiert, geupdated, verwaltet werden. Beispiele: npm, yarn, pnpm
* compiler: wandelt monderne Sprachfeatures und erweiterte Syntax (z.B. JSX, type annotations) in für den Browser verarbeitbaren Code um. Beispiele: Babel, TypeScript
* bundler: erlaubt Zusammenfassung von modularem Code in Pakete, um bspw. die Ladezeit zu optimieren. Beispiele: webpack, parcel, esbuild
* minifier: macht den geschriebene Code kompakter, damit dieser schneller geladen wird (z.B. Kommentare entfernen)
* linter: prüft Code auf häufige Fehler. Beispiel: eslint
* test runner: erlaubt das Ausführen von Tests. Beispiel: jest
* server: bearbeitet Anfragen von Clients. Beispiel (für Web/API): express

## Was ist NodeJS

NodeJS, häufig auch einfach als node bezeichnet, ist eine JavaScript (JS) Laufzeitumgebung in der JS-Code ohne Browser ausgeführt werden kann. Node ist damit praktisch ein Tool um *.js Dateien auf einem System auszuführen
und die Handhabung ist ähnlich wie mit Python oder PHP.

Folgendes sollte man über Node wissen:

* NodeJS benutzt die V8 Engine um den JS Code auszuführen, die selbe Engine wird auch in chromebasierenden Browsern eingesetzt.
* Node wurde mit dem Fokus auf Performance entwickelt und setzt auf sog. nonblocking I/O, d.h. das Programm wird durch I/O Zugriffe nicht "blockiert" und kann während der Wartezeit auf andere Ereignisse (events) reagieren.<br>
Im Programm wird das durch callbacks, Promises, async/await, etc. umgesetzt.<br>
*Anmerkung - Hintergrundwissen*: im Webbereich sind viele Operationen stark I/O lastig und weniger rechenintensiv.
* NodeJS kann durch Module erweitert werden, einige Module sind direkt in Node vorhanden und andere können mit dem Paketmanager npm (siehe weiter unten) installiert werden.
* NodeJS Module werden oft über require(...) für CommonJS oder einen ECMAScript import geladen.
* NodeJS kann auf viele Betriebssystemfunktionen zugreifen und daher kann JS-Code der mit NodeJS ausgeführt wird beispielsweise Netzwerkverbindungen öffnen, Dateien erstellen, etc. JS im Browser kann das typischerweise nicht, obwohl es heute schon für viele Funktionen standardisierte Browser APIs gibt.<br>
*Anmerkung*: Mit NodeJS kann man beispielsweise einen eigenen Webserver betreiben (ähnlich wie in ASP.NET).
* [Deno](https://deno.land/) bietet ähnliche Funktionen wie NodeJS, ist aber noch nicht so ausgiebig getestet.

JS-Code für NodeJS wird üblicherweise in der Kommandozeile so ausgeführt:

```shell
node dateiname.js
```

## Dateiendungen

NodeJS führt JavaScript-Code aus und Projekte werden in der Regel externe Softwareteile aus diversen Paketen benutzen. Die Pakete werden beispielsweise über den Paketmanager npm (siehe nächster Abschnitt) verwaltet. node bietet mehrere Techniken an, um externen Code einzubinden (z.B. `require(...)` oder `import`) und es ist wichtig schon zu Beginn die Unterschiede zu kennen, um bei Fehlern die Ursache zu erkennen ([hier Details](../02_javascript/README.md)).

* `.js` Dateien sind in der Regel CommonJS Dateien (außer es wird explizit anders angegeben) und erlauben die Einbindung von Paketen mit `require(...)`
* `.cjs` sind auch CommonJS Dateien
* `.mjs` Dateien sind sog. ES-Module und die Eindung von Paketen erfolgt über `import`
* wird beispielsweise in einer `.mjs` Datei ein Paket mit `require(...)` geladen, so wird eine Fehlermeldung (require is not defined in ES module scope) ausgegeben.
* wird ein `import` in einer CommonJS Datei versucht, so wird ebenfalls eine Fehlermeldung ausgegeben (cannot use import statement outside a module)
* Dateien mit der Endung `.test.js` oder `.spec.js` beinhalten in der Regel Testcode
* bestimmte Frameworks bieten erweiterte Funktionen und auch Dateitypen/-endungen. Beispielsweise hat VueJS sogenannte Single-File Components (SFC) mit der Dateiendung `.vue`, bei der HTML-Templates, CSS und JS-Code in einer Datei zusammenfasst werden. Damit node diese Dateien verarbeiten kann wird ein spezielles build setup benötigt, bei VueJS ist es beispielsweise Vite ([mehr hier](https://vuejs.org/guide/scaling-up/sfc.html))

## Paketmanager npm

Die Funktionalität von NodeJS kann durch Module erweitert werden. Einige Module sind standardmäßig schon in Node vorhanden, sehr viele können durch `npm` installiert werden und sollte sich für den eigenen Anwendungszweck kein Modul finden, so kann man auch selber neue Module entwickeln.

`npm` ist der node package manager, hier werden die Pakete sowie die Abhängigkeiten in NodeJS verwaltet. NPM ist damit die zentrale Plattform für das Paketmanagement in einem Projekt. Ein NodeJS Projekt erkennt man idR an der Datei `package.json` im Hauptverzeichnis, dort sind Informationen zum Projekt, die benötigten Pakete etc. hinterlegt.

Wenn man sich ein Projekt beispielsweise von Github klont, so werden die entsprechenden Pakete, diese würden sich im Ordner `node_modules` befinden, überlicherweise **nicht** mitkopiert. Ein guter Entwickler fügt `node_modules/*` in `.gitignore` ein und teilt Git mit, dass node Module von Git ignoriert werden sollen. Die Module können durch `npm install` nachinstalliert werden. Eine übliche Vorgangsweise bei einem Github-Repi würde so aussehen:

```shell
git clone <REPO-URL>
npm install
npm start
```

Ein eigenes Projekt kann mit `npm init` erzeugt werden. NPM fragt in interaktiv in der Kommandozeile nach den Projektdaten und erzeugt eine neue Datei `package.json`.

Verfügbare Pakete kann man über https://www.npmjs.com/ suchen. Als Beispiel schauen wir uns das Paket [`chalk`](https://www.npmjs.com/) an. Mit diesem kann man die Ausgabe (`console.log(...)`) farbig gestalten. Für unser Projekt wird chalk installiert:

```shell
npm install chalk
```

npm wird folgende Ausgabe erzeugen und einen neuen Ordner `node_modules` mit dem insallierten Modul anlegen:

```text
added 1 package, and audited 2 packages in 636ms

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Anmerkungen:

* npm Pakete liegen als source code im `node_modules` Ordner, dieser Ordner wird bei größeren Projekten daher tausende Dateien beinhalten. Der Ordner sollte daher ähnlich wie bei Git nicht kopiert werden.
* Wenn git genutzt wird, dann sollte der Ordner `node_modules` in `.gitignore` inkludiert werden.
* nicht alle npm Pakete sind überall verwendbar, achte hier auf die Dokumentation v.a. ob CommonJS (require) und/oder ES6-Module (import) verwendet wird.
* Es gibt auch andere Paketmanager, wie beispielsweise yarn.
* Werden Pakete mit npn installiert, so wird automatisch die Datei `package-lock.json` neu angelegt bzw. erweitert. Die Datei enthält die genauen Versionen der Pakete. In der `package.json` sind nur die Versionen der direkt installierten Pakete enthalten, die Versionen der Abhängigkeiten dieser Pakete findet sich nur in der Datei `package-lock.json`. Mit dem Versionslocking sollen Probleme verhindert und ein einheitlicher, nachvollziehbarer Softwarestand hergestellt werden.

## Traditionelle Webentwicklung

Das Internet existiert seit über 30 Jahren und im Technologiebereich gab es in vielen Bereichen diverse Innovationen. Beispielsweise gibt es das HTTP-Protokoll, um die Daten von Webseiten zu übertragen seit 1991 und hat bis heute diverse Erweiterungen erfahren (1996 - HTTP 1.0; 1999 - HTTP 1.1; 2015 HTTP 2.0; 2022 HTTP 3.0 und QUIC). Das "Grundkonzept" ist aber gleich geblieben.

Um die Technologien der heutigen Webseiten besser zu verstehen hilft es, sich anzusehen wie Webseiten früher entwickelt wurden und welche Probleme die Entwickler damals hatten.

Die ersten Webseiten waren in der Regel statische HTML-Webseiten. Im Serverbereich entstanden schnell die ersten Möglichkeiten um statt statischen Inhalten mittels Programmiersprachen auch dynamische Inhalte zu erzeugen. Diese Inhalte wurden serverseitig z.B. mit PHP, Perl etc. erzeugt und eine "fertige" Webseite an den Browser (Client) übertragen.

Im Browserbereich war anfangs Netscape führend und führte 1995 die Sprache LiveScript (heute JavaScript) ein, um dynamische clientseitige Webseiten zu erzeugen, die Funktionen sind allerdings nicht mit denen eines heutigen Browsers vergleichbar. Einfache DOM-Manipulationen etc. waren möglich, allerdings fehlte ein Sprachstandard. In den darauf folgenden Jahren wurde LiveScript in JavaScript umbenannt und von anderen Browsern (z.B. Internet Explorer) unterstützt, wobei sich JS-Code zwischen den Browsern oft nicht gleich verhalten hat.

Für Entwickler war diese unzureichende Standardisierung eine Hürde, so dass viele Webapplikationen die Inhalte immer serverseitig erzeugen und die fertige Webseite zum Anzeigen einfach an den Browser ausliefern. Dieses Pattern ist in der traditionellen Webentwicklung immer noch zu finden und hat den Vorteil, dass man sich nicht um browserspezifischen JS-Code kümmern muss, alles serverseitig erzeugen kann und hier natürlich die volle Kontrolle über Inhalt, Aussehen etc. hat. Um die Entwicklung zu Unterstützen gibt es zahlreiche Bibliotheken, die von Datenbankzugriff bis hin zu Template Engines, die gesamte Bandbreite abdecken.

In der traditionellen Webentwicklung hat sich vor allem PHP als Programmiersprache durchgesetzt. Hier existieren zahlreiche Frameworks (Laravel, Symfony, Yii, ...) und Tools (composer als "externer" Paketmanager) zur Webseitenentwicklung. Das MVC-Konzept (Model-View-Controller) ist als design pattern stark vertreten. PHP Webseiten können von handgemacht über einfache Template-Engines bis hin zur Nutzung von komplexen Frameworks alles abdecken und viele bekannte Projekte wie beispielsweise WordPress sind in PHP geschrieben.

## Moderne Webentwicklung: Frontend, Backend, APIs

Zwischen 2000-2010 kamen neue Browser auf den Markt und gewannen Marktanteile, so dass heute v.a. Chrome, Firefox und Edge/IE den Browsermarkt dominieren. Zusätzlich hat sich gegen Ende dieser Dekade ein neuer Trend entwickelt: Smartphones und Tablets. Diese mobiles Endgeräte haben zwar einen Browser, oftmals werden für eine bessere Benutzererfahrung und aufgrund der damals eingeschränkten Browser-APIs (GPS, Orientierungssensor, Kamera, ...) eigene "native" Apps benötigt.

Die nativen Apps kommunizieren oftmals über eine Webschnittstelle (Web-API) mit einem Webserver und erfüllen ähnliche Aufgaben wie die "traditionelle" Webseite - Beispiel social media - neue Beiträge checken:

* traditionelle Webapplikation: es gibt eine eigene Webseite dafür, es wird HTML erzeugt (Beiträge im HTML eingebettet) und an den Browser gesendet
* mobile native App: es gibt eine API, die die Beitragsdaten in einem Austauschformat (XML, JSON, ...) an die App sendet und diese zeigt die Inhalt passend an

Die Entwickler sahen hier schnell doppelte Arbeit und haben erkannt, dass die Webschnittstelle für die native App eigentlich auch für die Webseite verwendet werden kann - die Webseite wird damit praktisch eine App, die im Browser läuft. Der Browser fragt, ähnlich wie die native App, beim Server nach den Beiträgen und rendert die Inhalte dann passend - die **moderne Webentwicklung** war geboren.

Die konzeptionelle Umstellung führt daher zu einer Trennung zwischen Datenbereitstellung und Datenrepräsentation, es wird daher zwischen

* **Backend**: die Serverseite, hier werden die Daten aus der Datenbank geholt, und anhand der business logic verarbeitet; Zugriffberechtigungen etc. wird für die Ressource überprüft; als Ergebnis liegt eine API mit Endpunkten für gewisse Daten/Aktivitäten vor; als Programmiersprache kann fast alles eingesetzt werden - z.B. PHP, C# mit ASP.NET, Python, Perl, Ruby, ...
* **Frontend**: die Clientseite, hier werden die Daten vom Backend angezeigt, idR werden Frameworks wie React, Vue oder Angular verwendet; als Programmiersprache wird in der Regel JavaScript verwendet (die Frameworks bauen auf JavaScript/TypeScript auf)<br>
*Anmerkung*: durch die Einführung von WebAssembly können theoretisch fast alle Programmiersprachen eingesetzt werden

Ein großer Vorteil bei der "modernen" Webentwicklung mittels APIs ist, dass neue Clients (Web, native App, ...) sehr einfach über eine definierte Schnittstelle auf die Daten zugreifen können und dieser Entwicklungsbereich daher keine Abhängigkeiten erzeugt. Beispielsweise ist es damit einfach möglich einen eigenen Kommandozeilen-Client zum Abrufen neuer Beiträge aus dem obigen Beispiel selber in Java, Python, JavaScript etc. zu schreiben.

Einige Probleme sollten hier noch erwähnt werden:

* moderne Webseites, die auf APIs zugreifen haben beim Laden (durch einen Suchmaschinenbot) keine Daten und werden daher nicht gut indiziert und gerankt. Als Lösungskonzept bieten sich hybride Webseiten an: es wird am Server (meistens durch Node) eine "fertige" Webseite gerendert - die Daten werden statt der Platzhalter eingesetzt.
* moderne Webseiten verfügen meist über eine JS-Routing-Komponente, die Browseradresse wird hier auf die Entsprechende Webseite inkl. Zustand über JS ummgesetzt; zwischen den "Seitenaufrufen" muss der Server nicht kontaktiert werden; der Server muss allerdings entsprechend eingerichtet sein (redirects) und beim Debugging muss dieser Umstand entsprechend berücksichtigt werden.

APIs werden mittlerweile gut Dokumentiert und können beispielsweise als OpenAPI (früher Swagger) importiert werden. Es gibt entsprechende Tools, um APIs ohne App auszutesten und viele Programmiersprachen bieten entsprechende Funktionen zum Import und zur Verwendung der Endpunkte in der eigenen Applikation an.

## Unterschied clientseitiges und serverseitiges JS

Wie bereits erwähnt, kann JS mit Node oder im Browser ausgeführt werden. In der Webentwicklung gibt es eine Unterscheidung zwischen dem Client und dem Server.

* Der Client ist üblicherweise ein Benutzer bzw. Programm. Hier werden Daten abgefragt und idR angezeigt, eine rechenintensive Verarbeitung ist in dem meisten Fällen nicht vorgesehen, daher "kümmert" sich ein Client hauptsächlich um die Repräsentation der Informationen.
* Der Server bietet diese Daten an und wird im Webbereich auf eine Datenbank zurückgreifen und entsprechend den Anforderungen der Anwendung die Zugriffrechte prüfen, die Daten weiter verarbeiten, etc. - auch rechenintensive Aufgaben können vom Server übernommen werden.<br>
Üblicherweise wird der Server in einem Rechenzentrum untergebracht (gehostet) werden und über eine extrem schnelle Netzwerkanbindung verfügen. Weitere wichtige Eigenschaften von Servern (Verfügbarkeit etc. ) werden in anderen Fächern ausführlich behandelt.<br>
*Anmerkung*: Im Gegensatz zum Desktop-Bereich, wo Windows als Betriebssystem dominiert, sind im Serverbereich Unix-Betriebssysteme (z.B. Linux) im Einsatz. Diese sind sehr stabil und benötigen für den Betrieb keine graphische Oberfläche (GUI). Es ist daher sicherlich eine gute Idee, etwas Zeit in die Grundlagen von Linux zu investieren und beispielsweise die Kommandozeile (shell) kennen zu lernen! Auf Windows bietet sich dafür WSL2 an.

JavaScript kann daher sowohl am Client, als auch am Server betrieben werden. Generell helfen folgende Regeln:

* Node wird immer "serverseitig" ausgeührt, in schulischen Kontext betrieben wir einen kleinen Entwicklungsserver am lokalen Computer; mit Node haben wir vollen Zugriff auf Betriebssystemfunktionen, wir können Dateien lesen, schreiben etc.
* Aller JS-Code der über HTML im Browser ausgeführt wird (`<script>...</script>` oder `<script src="..."></script>`) ist clientseitig; als clientseitiger Code wird der am Computer des Benutzers ausgeführt und hat dort weniger Rechte - es können beispielsweise (ohne Rückfragen) keine Dateien angelegt werden etc.
* Gewisse JavaScript Objekte, die wir aus dem Browser kennen wie `window` oder `document` gibt es in Node nicht, ebenso werden gewisse Funktionen wie `alert(...)` nicht vorhanden sein

Zu Beginn kann folgende Situation im Webentwicklungsbereich etwas verwirrend sein: Für gewisse Frameworks gibt es die Möglichkeit den *clientseitigen* JS-Code mit Node zu erzeugen. Node wird in diesen Fällen **NUR** eingesetzt, um den JS-Code für den Browser (Client) zu erzeugen und muss im Betrieb der Webapplikation nicht verwendet werden. Es wird praktisch die ganze Webapp (mit HTML und JS) in einem Ordner erzeugt und kann dann auf den Webserver kopiert werden.

Verwirrender wird die Situation, wenn Node zusätzlich als Webserver eingesetzt wird, um sowohl die Daten, als auch den clientseitigen Code bereit zu stellen. Hier übernimmt Node dann beide Funktionen: Webserver für die API und Erzeugung der Clientseitigen Webapp inkl. Bereitstellung durch den Webserver. Dieses Konzept wird durch sog. hybride Webseiten weiterentwickelt, denn dort erhält der Browser statt des leeren Templates, wo normalerweise die Daten von der API abgefragt und befüllt werden, eine vom Server vorbefüllte Seite. Hybride Webseiten ermöglichen Suchmaschinen, die Webseite einfacher zu indizieren.

## Demos

Es befinden sich diverse Demos in diesem Repository. Die Node-Pakete für Demos (z.B. 01_node_basics) können wie folgt installiert und gestartet werden:

```shell
cd 01_node_basics
npm install
node index.js
```

Ein laufendes Node-Programm (z.B. ein Webserver) kann mit *Ctrl+C* in der Kommandozeile wieder beendet werden.

In der Praxis werden in der Datei `package.json` auch Befehle im `scripts` Objekt hinterlegt. Diese können mit `npm run SKRIPTNAME` ausgeführt werden.