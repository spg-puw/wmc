# Installation der benötigten Software

## Node.js

### Windows

Lade von https://nodejs.org/en/ die LTS Version von Node.js. Beachte bei der Installation folgendes:

Installiere den Server unter Windows in *C:\\nodejs* und nicht in einem tief verschachtelten Verzeichnis.

Am Ende der Installation sollte der Befehl *node --version* die aktuelle Version ausgeben:

```ps
C:\Users\MyUser>node --version
v16.13.1
```

### macOS

Verwende für die Installation unter macOS die Software Homebrew (https://brew.sh/) oder noch besser MacPorts (https://www.macports.org/).

* HomeBrew: Danach kann mit `brew install node` im Terminal Node.js installiert werden.
* MacPorts: Node.js wird mit `sudo port install nodejs19` installiert; die 19 steht für die Version
* MacPorts: NPM (node package manager) wird mit `sudo port install npm8` installiert

Nach der Installation steht node im Terminal / der Shell zur Verfügung:

```shell
% node -v
v19.0.0
```

### Linux

Unter Linux einfach den Paketmanager der Distribution verwenden und das Paket node installieren, danach kann es in der Shell verwendet werden.

```shell
$ node -v
v19.0.0
```

## Visual Studio Code

Zum Entwickeln von JavaScript Code gibt es natürlich viele IDEs und Editoren. Wir werden Visual
Studio Code verwenden. Lade daher von https://code.visualstudio.com/ den Editor für dein
Betriebssystem herunter.

> **Windows-Hinweis:** Aktiviere beim Setup die Option
>  *Add "Open with Code" action to Windows Explorer file context menu* und
>  *Add "Open with Code" action to Windows Explorer directory context menu*.
> Da Node.js Projekte nicht als Einzeldatei geöffnet werden können, ist diese Option sehr hilfreich!

> **WSL / Linux / macOS-Hinweis:**
> Du kannst VS Code aus der Shell immer mit dem Kommando `code .` für den aktuellen Ordner starten!
> VS Code öffnet den entsprechenden Ordner und stellt auch vergangene Sessions wieder her.

> **macOS-Hinweis:**
> Du kannst in der Shell mit dem Kommando `open .` ein Finder-Fenster vom aktuellen Ort öffnen.

> **macOS-Hinweis:**
> Du kannst die integrierte Kommandozeile von VS Code mit *Ctrl+Shift+`* öffnen/anzeigen.

Danach installiere über das Extension Menü die folgenden Extensions:

- *Vetur* für die Entwicklung von Vue.js Applikationen.
- Optional: *Better Comments*: Bestimmte Kommentar klarer anzeigen
- Optional: *PHP Extension Pack*
- Optional: *PHP Intelephense*
- Optional: *Remote - SSH*: SSH-Targets (z.B. fremde Server) öffenen und dort direkt mit VS-Code entwickeln

Öffne nun die Einstellungen (Drücke *F1* oder *SHIFT+CMD+P* für die Menüzeile. Gib dann  
*settings* ein und wähle den Punkt *Preferences: Open User Settings (JSON)*. Füge die folgenden
Einstellungen in die Datei ein und speichere sie ab:

```json
{
    "editor.bracketPairColorization.enabled": true,    
    "security.workspace.trust.untrustedFiles": "open",
    "editor.minimap.enabled": false,
    "editor.rulers": [
        100
    ],    
    "vetur.format.options.tabSize": 4,
    "vetur.format.options.useTabs": false,
    "vetur.format.defaultFormatterOptions": {
        "prettier": {
            "printWidth": 100,
            "singleQuote": true
        }     
    },
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "extensions.ignoreRecommendations": true
}
```
