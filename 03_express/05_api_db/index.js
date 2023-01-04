require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const favicon = require("serve-favicon");
const serveIndex = require("serve-index");
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
// const session = require("express-session"); //only for dev environment!

const errorHandlerMiddleware = require("./lib/errorHandlerMiddleware").defaultErrorHandler;
const rateLimitMiddleware = require("./lib/rateLimitMiddleware");
const customLoggingMiddleware = require("./lib/customLoggingMiddleware");

const routes = require("./routes");
const app = express();

//middleware setup
app.use(customLoggingMiddleware);
app.use(rateLimitMiddleware);
app.use(morgan("common")); //logging middleware
app.use(helmet({ contentSecurityPolicy: false, })); //middleware to secure express app with some default headers
//ACHTUNG: im Produktivbetrieb die contentSecurityPolicy (CSP) nicht ausschalten!
app.use(favicon(path.join(__dirname, "public", "favicon.ico"))); //serve favicon
app.use("/public", express.static("public"), serveIndex('public', { 'icons': true })); //serve static files from public
app.use(compression()); //compression middleware for static files and json
app.use(bodyParser.urlencoded({ extended: true })); //middleware to parse incoming request bodies (but not multipart)
app.use(cookieParser()); //cookie middleware, expose cookies to req.cookies
app.use(methodOverride('_method')); //override with e.g. ?_method=DELETE
app.use(methodOverride('X-HTTP-Method')) //Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) //Google/GData
app.use(methodOverride('X-Method-Override')) //IBM
// app.use(session({ secret: "secret", saveUninitialized: true, cookie: { maxAge: (1000 * 60 * 60 * 24), secure: true }, name: "sess", resave: false })); //session middleware

//views
app.set("view engine", "pug");
app.set("views", "./views");
app.locals.moment = require('moment'); //date and time lib

//routes
app.use("/api", routes);
app.use("/", routes);

//error handler
app.use(errorHandlerMiddleware);

//server setup
let port = process.env.PORT || 4000;

//also allow server to be started with port as command line argument
const portArg = process.argv[2];
if (portArg !== undefined && !Number.isNaN(parseInt(portArg, 10))) {
   port = parseInt(portArg, 10);
}

const server = app.listen(port, () => {
   console.log(`Server is running on ${server.address().address}:${port}`);
   console.log("Environment: " + process.env.NODE_ENV);
});