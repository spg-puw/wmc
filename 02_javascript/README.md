# JavaScript Grundlagen
- [Einführung](https://github.com/schletz/Wmc/blob/main/31_JavaScript/10_ECMAscript.md)
  - NodeJS
  - JS und ES
  - MDN
  - Polyfill
- [Variablen und Datentypen](https://github.com/schletz/Wmc/blob/main/31_JavaScript/20_Variables.md)
  - Deklaration
  - Datentypen
  - Typenkonversion
  - Date
  - Ergänzungen
    - **var hoisting**: in JavaScript können Variablen benutzt werden, bevor sie überhaupt mit `var` deklariert wurden (hoisting); außerdem gelten seltsame scope Regeln (function/global) - beide Verhaltensweisen führen manchmal zu Fehlern
    - **const** bedeutet nicht automatisch unveränderbar: *Achtung!*: const 'schützt' den 'Wert' einer Variable vor Änderungen; bei primitiven Datentypen sind die Werte dann auch nicht veränderbar (immutable); bei Objekten/Arrays usw. wird in der Variable aber nur die *Referenz* gespeichert (man kann mit der Variable kein neues/anderes Objekt referenzieren), das Objekt selber kann aber noch gerändert werden (siehe Beispiel)<br>
      ```js
      try {
        const myVar = 1;
        myVar = 2;
      } catch (error) {
        console.error(error, 'das geht nicht ...'); // TypeError: invalid assignment to const 'myVar'
      }
      
      const myObj = { name: 'Max Mustermann', age: 16 };
      myObj.age = 17;
      myObj.name = "Hans Wurst";
      myObj.newPorp = "bla";
      console.log(myObj); // Object { name: "Hans Wurst", age: 17, newPorp: "bla" }

      const myArr = [];
      myArr.push(1);
      myArr.push(2);
      myArr.push(3);
      myArr[0] = 0;
      console.log(myArr); // Array(3) [ 0, 2, 3 ]
      ```
    - **Object.[freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)(...)**: damit kann man ein Objekt vor Veränderung (Ändern von Properties (Außnahme setter) und Erweiterung) schützen
      ```js
      const obj = { prop: 42 };
      Object.freeze(obj);

      try {
        obj.prop = 33; // ignorieren, wenn nicht im strict mode
      } catch (error) {
        console.error(error, "error im strict mode");
      }

      console.log(obj.prop); // 42
      ```
  - Aufgabe: Aufgabe0201_Basics
- [JSON, Arrays und Sets](https://github.com/schletz/Wmc/blob/main/31_JavaScript/30_JSON_Arrays.md)
  - JSON
  - Referenzen, Umgang mit Properties
  - Arrays
  - Set
  - Iteration
  - Ergänzungen
    - **[spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)**: mit dem spread `...` werden Arrays/Strings expandiert; das kann beispielsweise in folgenden Situationen nützlich sein
      ```js
      // shallow copy of an array
      const arr1 = [1, 2, 3];
      const arr2 = arr1; // Achtung: es wird hier NUR die Referenz kopiert!
      const arr2_spread = [...arr1];
      arr2.push(4);
      arr2_spread.push(5);
      console.log(arr1); // Array [1, 2, 3, 4] - die 4 ist "zu viel"
      console.log(arr2); // Array [1, 2, 3, 4]
      console.log(arr2_spread); // Array [1, 2, 3, 5] - hier ist keine 4
      ```
    - **shallow copy**: mit dem spread kann man eine sog. *shallow copy* (manchmal auch *shallow cloning*) erzeugen; ähnliches kann auch mit Object.assign(...) erreicht werden, Object.assign kann das Objekt allerdings verändern (mutation) und es werden die setter aufgerufen. Mehr dazu [hier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)
      ```js
      const obj1 = { foo: "bar", x: 42 };
      const obj2 = { foo: "baz", y: 13 };
      const clonedObj = { ...obj1 }; // { foo: "bar", x: 42 }
      const mergedObj = { ...obj1, ...obj2 }; // { foo: "baz", x: 42, y: 13 }
      ```
    - **deep copy**: bei einer sog. *deepCopy* werden auch die verschachtelten Properties (z.B. obj1.prop1.subprop2.something) eines Objekte echt kopiert und nicht nur die *Referenzen*. Mit Array.from(...) und Object.assign(...) und dem spread kann bspw. nur eine shallow copy erzeugt werden.<br>
    <br>
    Der übliche Weg ist mittels JSON.parse und JSON.stringigy:
      ```js
      let objCopy = JSON.parse(JSON.stringify(objOriginal));
      ```
      Ein neuerer Weg ist mittels [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone):
      ```js
      const mushrooms1 = {
        amanita: ["muscaria", "virosa"],
      };

      const mushrooms2 = structuredClone(mushrooms1);

      mushrooms2.amanita.push("pantherina");
      mushrooms1.amanita.pop();

      console.log(mushrooms2.amanita); // ["muscaria", "virosa", "pantherina"]
      console.log(mushrooms1.amanita); // ["muscaria"]
      ```
    
    - **[destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)**: Python-Programmierer werden es kennen und lieben ...
      ```js
      let a, b, rest;
      [a, b] = [10, 20];
      console.log(a); // 10
      console.log(b); // 20

      [a, b, ...rest] = [10, 20, 30, 40, 50];
      console.log(rest); // Array [30, 40, 50]
      ```
      Man sieht das ganze auch häufig bei imports:
        ```js
        import { x } from 'somepackage';
        ```
    - **for (in/of) vs. Array.forEach(...)**: Achtung die beiden Iterationsmöglichkeiten sehen ähnlich aus, führen aber manchmal zu anderen/unerwarteten Ergebnissen:
      ```js
      const arr = ["das", "ist", "ein", "array"];

      arr.forEach((e) => {
        if (e == "ein") return;
        console.log(e);
      })
      // Ergebnis:
      // das
      // ist
      // array

      for (e of arr) {
        if (e == "ein") break;
        console.log(e);
      }
      // Ergebnis:
      // das
      // ist
      ```
    - **optional chains** und **nullish coalescing operator**: wenn man bei einem Objekt auf nicht existierende Properties zugreift (`myObj.nonexistingProp`), wird `undefined` zurückgegeben. Versucht man auf ein nestes Property eines nicht existierenden Properties (`myObj.nonexistingProp.nestedProp`) zuzugreifen, wird ein TypeError Exception ausgelöst.<br>
    Häufig will man auf nestes values von Objekten zugreifen (oder alternativ ein default value benutzen). In diesen Fällen bietet sich folgende Konstruktion:<br>
    `const myValue = someObj?.maybeExistingProperty?.nestedProperty ?? "defaultValue";`
  - Aufgabe: Aufgabe0202_Meeting, Aufgabe0203_Wetter
- Funktionen
  - [Callbacks und Closures](https://github.com/schletz/Wmc/blob/main/31_JavaScript/40_FunctionsCallback.md)
    - Aufgabe: Aufgabe0204_PubSub
  - [Prototype, this und new](https://github.com/schletz/Wmc/blob/main/31_JavaScript/41_FunctionsPrototype.md)
    - Aufgabe: Aufgabe0205_Funktionen
  - [Arrow functions und Arraymethoden](https://github.com/schletz/Wmc/blob/main/31_JavaScript/42_FunctionsArrowFunctions.md)
    - Aufgabe: Aufgabe0206_Store
  - Ergänzungen:
    - **Array Methoden**: JavaScript bietet bereits eine Vielzahl an sehr nützlichen eingebauten Methoden
        - array.[at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)(...): Zugriff auf ein Element; wenn man das letzte Element haben will: `myArr.at(-1)`
        - array.[every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)(...), array.[some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)(...): Testen, ob alle/einige Elemente im Array gewisse Bedingungen erfüllen<br>
          ```js
          const nums = [1, 2, 99, -1, 5];
          console.log(nums.every(n => n > 0)) // false
          console.log(nums.some(n => n > 0)) // true
          console.log(nums.some(n => n > 100)) // false
          ```
        - array.[push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)(...), array.[pop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)(): Element an des Ende des Array anfügen/vom Ende wegnehmen
        - array.[map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)(...): Erstellt ein neues Array, wobei jedes Element über eine Funktion mit den Wertden des alten Arrays generiert wird
          ```js
          const array1 = [1, 2, 3];
          const array2 = array1.map(x => x * 2); // alle Werte verdoppeln
          console.log(array2); // Array [2, 4, 6]
          ```
        - array.[sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)(...): Arrayelemente mittels einer bereitgestellten Funktion sortieren; es können z.B. Objekte, die in einem Array sind nach einem bestimmten Schlüssel (key) sortiert werden
          ```js
          const students = [
            { name: "Peter", grade: 2 },
            { name: "Anna", grade: 3 },
            { name: "Xi", grade: 1 },
          ];
          students.sort((a, b) => a.grade - b.grade);
          console.log(students); // Array [{ name: "Xi", grade: 1 }, { name: "Peter", grade: 2 }, { name: "Anna", grade: 3 }]
          ```
    - **arrow functions** und **this**: *Achtung!* bei normalen Funktionen bezieht sich `this` auf das aufrufende Objekt (z.B. button); bei arrow functions bezieht sich `this` auf das Objekt, welches die Funktion definiert hat (z.B. window)!<br>
    Beispiele siehe [hier](https://www.w3schools.com/Js/js_arrow_function.asp)
    - **this**: der Wert von `this` kann bei Funktionen mit den speziellen Prototyp-Methoden [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)/[bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)/[call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) verändert werden!
- [Classes](https://github.com/schletz/Wmc/blob/main/31_JavaScript/50_Classes.md)
- [Modules](https://github.com/schletz/Wmc/blob/main/31_JavaScript/60_Modules.md)
  - Ergänzungen
    - **[CommonJS-Module](https://nodejs.org/api/modules.html) und [ES-Module](https://nodejs.org/api/esm.html)**
      - CommonJS ist das ursprüngliche NodeJS Modulformat und man erkennt es an den require-statements: `const something = require('modulename');`<br>
      innerhalb des Moduls befindet sich ein `module.exports` Objekt.
      - CommonJS Dateien haben entweder explizit eine `.cjs` Dateiendung oder node interpretiert jede normale `.js` Datei im CommonJS Format, wenn im *package.json* **nicht** `type: 'module'` gesetzt ist
      - ES-Module haben eine `.mjs`-Endung, können aber auch `.js` verwenden, wenn im *package.json* `type: 'module'` gesetzt wurde
      - ES-Module werden mittels `import` geladen und verwenden das `export`-Keyword innerhalb des Moduls. ES-Module sind standardisierter, nodejs unterstützt diese aber erst ab Version 13+
      - Soll ein Modul auch im Browser benutzerbar sein, so sollte es als ES-Modul geschrieben sein.
      - Ein sehr verständlicher Vergleich findet sich [hier](https://nuxt.com/docs/guide/concepts/esm)
    
    - **Promise** und **async/await**: [diese Seite lesen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)<br>
    *Promise*: für asynchrone Operationen und um callback-hell/chaining zu reduzieren; erkennbar bspw. an den `.then(...)` und `.catch(...)` Aufrufen.<br>
    *`async`/`await`* baut auf Promise auf; await kann nur innerhalb einer async-Funktion aufgerufen werden und hält den Code an, bis das entsprechende Promise erfüllt wurde (fulfilled) oder ein Fehler gewofen wurde (rejected). Die Fehlerbehandlung findet in einem try/catch-Blick statt in `.catch(...)` statt.<br>
    [Hier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#async_functions_and_execution_order) ein zusammenfassendes Beispiel:
      ```js
      function resolveAfter2Seconds() {
        console.log("starting slow promise");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("slow");
            console.log("slow promise is done");
          }, 2000);
        });
      }

      function resolveAfter1Second() {
        console.log("starting fast promise");
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("fast");
            console.log("fast promise is done");
          }, 1000);
        });
      }

      async function sequentialStart() {
        console.log("==SEQUENTIAL START==");

        // 1. Execution gets here almost instantly
        const slow = await resolveAfter2Seconds();
        console.log(slow); // 2. this runs 2 seconds after 1.

        const fast = await resolveAfter1Second();
        console.log(fast); // 3. this runs 3 seconds after 1.
      }

      async function concurrentStart() {
        console.log("==CONCURRENT START with await==");
        const slow = resolveAfter2Seconds(); // starts timer immediately
        const fast = resolveAfter1Second(); // starts timer immediately

        // 1. Execution gets here almost instantly
        console.log(await slow); // 2. this runs 2 seconds after 1.
        console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
      }

      function concurrentPromise() {
        console.log("==CONCURRENT START with Promise.all==");
        return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
          (messages) => {
            console.log(messages[0]); // slow
            console.log(messages[1]); // fast
          },
        );
      }

      async function parallel() {
        console.log("==PARALLEL with await Promise.all==");

        // Start 2 "jobs" in parallel and wait for both of them to complete
        await Promise.all([
          (async () => console.log(await resolveAfter2Seconds()))(),
          (async () => console.log(await resolveAfter1Second()))(),
        ]);
      }

      sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"

      // wait above to finish
      setTimeout(concurrentStart, 4000); // after 2 seconds, logs "slow" and then "fast"

      // wait again
      setTimeout(concurrentPromise, 7000); // same as concurrentStart

      // wait again
      setTimeout(parallel, 10000); // truly parallel: after 1 second, logs "fast", then after 1 more second, "slow"
      ```
    - **IIFE** und **top-level await**: NodeJS unterstützt seit v14 das sog. top-level await, damit kann await auch direkt (ohne extra async-Funktion) in node genutzt werden. Seit ES2020 kann await auch direkt (top-level) in Modulen benutzt werden.<br>
    Als Workaround wurden davor *[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)s* (immediately invoked function expression) benutzt. Diese haben folgende Strutkur:
      ```js
        // wenn kein top-level await verfügbar oder aus Kompatibilitätsgründen
        (async () => {
          const x = await something();
        })();
      ```
  - Aufgabe: Aufgabe0207_COVID