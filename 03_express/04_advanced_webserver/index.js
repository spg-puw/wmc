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

const app = express();
const routes = require("./routes");

//middleware setup
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

//views
app.set("view engine", "pug");
app.set("views", "./views");
app.locals.moment = require('moment'); //additional date and time lib, better than native JS Date

//routes
app.use("/", routes); //handle all requests starting with / with route handler

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