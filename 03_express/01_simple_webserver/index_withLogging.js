const express = require('express')
const app = express()
const port = 3000

app.use('/api', function(req, res, next){
  res.set('API-Header', 'wichtiger Header für die API Clients'); // eigener Code

  next(); // ruft die nächste Middleware auf
});

const simpleLogger = function (req, res, next) {
  console.log(`logging something`);

  next();
}
app.use(simpleLogger);

const advancedLogger = function(loggerPrefix) {
  return function (req, res, next) {
      console.log(`${loggerPrefix}: logging something`);
      
      next();
  }
}
app.use(advancedLogger('myprefix'));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/api', (req, res) => {
  res.send('Header beachten!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})