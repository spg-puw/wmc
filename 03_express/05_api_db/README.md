# Mini API mit DB

Hier werden kurz neue Konzepte für kleine APIs vorgestellt.

* Middleware
  * `lib/customLoggingMiddleware`: gibt eine kurze Information aus wenn ein neuer request empfangen wird
  * `lib/errorHandlerMiddleware`: eigener Errorhandler, der 401 und 500 Status-Codes behandelt
  * `lib/rateLimitMiddleware`: beschränkt die Anzahl der Zugriffe auf die API
  * `lib/authMiddleware`: behandelt JWT-Tokens (Auth-Header oder _jwt Query-Parameter), die Middleware schützt Endpunkte durch `guard(...)` (siehe Routen)
* JWT (JSON Web Token): Ein Grundprinzip von REST Webservices ist die Zustandslosigkeit, eine Anfrage sollte alle Informationen für den Server beinhalten - auch "Logindaten" für gesicherte Endpunkte; da man bei APIs ungerne die ganzen Logindaten sendet, setzt man häufig auf Tokens o.ä.; in JWT kann man eine beliebige Payload übermitteln (in unserem Fall userId und permissions), das Token ist vom Server signiert und kann bspw. auch für mehrere APIs verwendet werden (siehe Microservices); Meistens wird das Token mit dem HTTP-Header `Authorization: Bearer hier_kommt_das_JWT_Token_hin` übermittelt
  * die Token werden über die `/auth` Endpunkte erzeugt
  * gesicherte Endpunkte brauchen ein Token über den Header `Authorization` oder die Query-Parameter `_jwt=`
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
  * Achtung: SQLite hat einige Einschränkungen (siehe https://www.sqlite.org/about.html)
  * die Datenbank wird von nodejs automatisch erzeugt und geseedet (mit Werten befüllt), wenn man dan Server erstmalig startet
  * man kann auch ganz einfach den eigenen DB-Server verwenden, die verwendete Library unterstützt die gängisten DB-Systeme wie MS-SQL, MySQL/MariaDB, etc.; hier empfehlen sich XAMPP (MariaDB) oder ein eigener Docker-Container (Einstellungen in `db/config.json`)
  * Die DB-Library ist ein ORM (Object Relational Mapper), ist damit in der Verwendung ähnlich zu EFCore bei C# etc.; die Tabellen sind JS-Objekte/Klassen und man muss idR keine SQL-Queries manuell schreiben
* OpenAPI
  * die Endpunkte sind via OpenAPI dokumentiert; siehe `/doc`
  * bei gesicherten Endpunkten (siehe Schloss, rechte Seite beim Pfeil) muss man zuerst das entsprechende Token eintragen (und vorher natürlich generieren)