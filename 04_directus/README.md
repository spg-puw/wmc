# Directus

## Inhalt

- Einführung
- Warum Directus?
- Installationsschritte
- Quick-Start Guide
- Erweiterungen
  - Endpoints
  - Hooks
- Deployment

[zurück](../README.md)

## Einführung

> Directus is an Open Data Platform built to democratize the database.
> This platform provides everyone on your team, regardless of technical skill, equal access to data and digital file asset management, for any data model or project. First, link Directus to your desired SQL database and file storage adapter. After that, Directus enables you to perform CRUD operations, create users, assign roles with fully configurable permissions, build complex and granular queries, configure event-driven webhooks and task automation... the list goes on!
> <br />[siehe Directus Website](https://docs.directus.io/getting-started/introduction.html)

Directus bietet die Möglichkeit eine REST+GraphQL API für eine Reihe von Datenbanksystemen automatisch zu erzeugen. Die Daten werden über eine no-code Applikation verwaltet. Die API kann einfach über eigene Module um gewünschte Fähigkeiten erweitert werden, denn es wird express als Basis verwendet. Die Architektur von Directus ist [hier](https://docs.directus.io/getting-started/architecture.html) kompakt beschrieben.

Als Alternative mit ähnlichen Fähigkeiten soll an dieser Stelle auch [strapi](https://strapi.io/) erwähnt werden.

## Warum Directus?

Warum sollte man nun Directus verwenden? Die Antwort ist ganz einfach: Zeitersparnis. Für eigene (kleinere) Webprojekte wird normalerweise die Datenbank modelliert, die Datenstruktur erzeugt und angelegt, anschließend die REST-API geschrieben und das Frontend programmiert. Die REST-API wird oft ähnliche Funktionen aufweisen müssen:

- Authentifizierung & Autorisierung: Benutzer anmelden, verwalten und Rechte zu bestimmten Ressourcen/Endpoints geben
- CRUD-Operationen der Datenbank in der API abbilden
- API-Dokumentation bereitstellen (z.B. OpenAPI spec)
- Backend zur Datenverwaltung bereitstellen

Hier fällt schnell auf, dass diese Funktionen bei unterschiedlichen Projekten sehr ähnlich sind. Statt alles selber zu schreiben, kann mit Directus eine getestete und gewartete Codebasis verwendet werden, um die Standardfunktionen schnell für das eigene Projekte bereit zu stellen und notwendige Erweiterungen können ergänzt werden.

## Installationsschritte

Directus basiert auf nodejs, express (für die API), [Knex](https://knexjs.org/) (SQL query builder zur Datenbankabstraktion) und Vue (für Erweiterungen des Verwaltungstools - *Data Studio App*). Die Installation erfolgt mit folgenden Kommandos (siehe [hier](https://docs.directus.io/self-hosted/cli.html) für die Dokumentation):

```sh
npm init
npm install directus
npm exec directus init --package=@directus/app
(database client: SQLite; database File Path: ./data.db)
npm exec directus start --package=@directus/app
```

Anschließend kann Directus unter http://localhost:8055 erreicht werden. Die Daten (collections) sind normalerweise unter dem Pfad `/items` erreichbar.

Die Kofiguration wird zentral über die Datei `.env` verwaltet. Dort können weitere Einstellungen wie bspw. SSO oder E-Mailversand vorgenommen werden. Bei Dockercontainern können diese Einstellungen als Umgebungsvariable übergeben werden.

## Quick-Start Guide

(siehe PDF in Moodle)

- Directus starten und einloggen
- Collections (Tabellen) anlegen und Beziehungen festlegen
- Zugriffsrechte für die collections festlegen
- Wenn assets (z.B. Bilder, Dateien) verwendet werden, dann auch die Zugriffrechte für die Systemcollection `directus files` festlegen. Assets können später unter dem Pfad `/assets/id-des-assets` aufgerufen werden.
- Sollen Relationen in den Abfragen auch aufgelöst werden, so kann dies bspw. mit folgendem Queryparameter bei der API gesteuert werden: `/items/mycollection?fields=*.*`

## Erweiterungen

Standardmäßig wird der Ordner `extensions` mit einigen Unterordnern für Erweiterungen angelegt. Für die API-Entwicklung sind vor allem folgende Extensionordner interessant:

- [endpoints](https://docs.directus.io/extensions/endpoints.html)
- [hooks](https://docs.directus.io/extensions/hooks.html)
- [templates](https://docs.directus.io/extensions/email-templates.html)

### Endpoints

> Custom API Endpoints register new API routes which can be used to infinitely extend the core functionality of the platform.

Mit Endpoint-Extensions können ganz normale express-endpoints mit eigenem Code geschrieben werden. Es wird das express-router Objekt sowie ein context-Objekt mit den Directus-Objekten/Services bereitgestellt.

Folgendes Beispiel zeigt eine kleine Demoextension mit Endpoints. Den Code in `/extensions/endpoints/myextensionname/index.mjs` kopieren.

```js
export default {
  id: 'newendpoint',
  handler: async (router, context) => {
    const { services, database, getSchema } = context;
    const { MailService, ItemsService } = services;
    const schema = await getSchema();

    router.get('/', (req, res) => res.send('das kann mittels /newendpoint/ erreicht werden'));

    router.get('/useroperation', async (req, res, next) => { // /newendpoint/useroperation?mail=xxx@yyy.zzz
      const userMail = req.query.mail;
      const userService = new ItemsService('directus_users', { schema: req.schema });
      const users = await userService.readByQuery({ filter: { email: { _eq: userMail } }, fields: ['*'] });
      console.log(`das erscheint am Server auf der Konsole`);
      res.send(users);
    });
  },
}
```

Eine weitere Demostration mit einem Public-API-Proxy findet sich [hier](https://docs.directus.io/guides/extensions/endpoints-api-proxy.html).

### Hooks

> Custom API Hooks allow running custom logic when a specified event occurs within your project.

Hooks führen Code bei gewissen Events aus (Item angelegt/geupdated/...; User eingeloggt; Server gestartet etc.). Welche Eventtypen es gibt findet man [hier](https://docs.directus.io/extensions/hooks.html#available-events).

Besonders wichtig sind folgende Hooks:

- **filter**: Filter hooks act on the event's payload before the event is fired. They allow you to check, modify, or cancel an event.<br />Beispiel: Eingabedaten überprüfen
- **action**: Action hooks execute *after* a defined event and receive data related to the event. Use action hooks when you need to automate responses to CRUD events on items or server actions.<br />Beispiel: E-Mail nach Erstellung eines Datensatzes versenden
- **schedule**: Schedule hooks execute at certain points in time rather than when Directus performs a specific action. This is supported through node-schedule.<br />Beispiel: Code alle 15 Minuten laufen lassen

Folgendes Beispiel zeigt eine kleine Demoextension mit Hooks. Den Code in `/extensions/hooks/myextensionname/index.mjs` kopieren.

```js
console.log('loading extension (info in server log)');

export default ({ filter, action, init, schedule, embed }, { services, exceptions, env, database, emitter, logger, getSchema }) => {
  const { AssetsService, MailService, ItemsService, UsersService } = services;

  filter('items.create', () => {
    console.log('Creating Item!');
    console.log('hier Code um die Daten zu verändern');
  });

  action('items.create', () => {
    console.log('Item created!');
    console.log('hier Logik nach dem Erstellen ausführen, z.B. Mail versenden');
  });
};
```

Eine weitere Demostration mit Telefonnummerncheck findet sich [hier](https://docs.directus.io/guides/extensions/hooks-validate-number-twilio.html).

## Deployment

Directus ist ganz einfach via Docker bereit zu stellen, siehe [hier](https://docs.directus.io/self-hosted/docker-guide.html). Statt der `.env` Datei können die entsprechenden Konfigurationen auch mit Umgebungsvariablen in Docker vorgenommen werden. Es sind daher im Minimalfall nur der Datenbankzugriff (Datei in volume/mount oder Datenbank als Container/unix-socket/...) und die Erweiterungen (falls vorhanden) erforderlich.

Um den Einstieg für Benutzer mit wenig Vorerfahrung zu erleichtern, ist es sicherlich empfehlenswert entsprechende Skripts in `package.json` vorzusehen.

```json
"scripts": {
    "start": "npm exec --package=@directus/app directus start",
    "help": "echo \"see https://docs.directus.io/self-hosted/cli.html for more CLI commands\"",
    "bootstrap": "npm exec --package=@directus/app directus bootstrap",
    "migrate:latest": "npm exec --package=@directus/app directus database migrate:latest",
    "create-snapshot": "npm exec --package=@directus/app directus schema snapshot ./snapshots/\"$(date \"+%F\" \"-snapshot-\"$(date \"+%s\")\".yaml"
}
```

*Anmerkung*: mit `npm exec --package=@directus/app directus` kann die Directus CLI aufgerufen werden, ohne Directus global zu installieren, was v.a. Versionskonflikten vorbeugt. Es wird also Direktus aus `node_modules` verwendet.

Mit den Skripts kann die Directus Instanz bei neuen Usern dann mit folgenden Kommandos gestartet werden:

```sh
npm install
npm run start
```
