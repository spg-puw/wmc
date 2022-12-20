const express = require("express");
const router = express.Router();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

//openapi documentation
const doc = swaggerJsdoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Meine API',
            version: '1.0.0',
            description: 'this document contains infos about my API',
            license: {
                name: 'GPL',
                url: 'https://www.gnu.org/licenses/gpl-3.0.html',
            },
            contact: {
                name: 'John Doe',
                url: 'https://www.spengergasse.at/',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/',
                description: 'Development server',
            },
            {
                url: 'https://api.mydomain.tld/',
                description: 'Production server',
            },
        ],
    },
    apis: [
        "./routes/*.js",
    ],
});
const opts = { explorer: true, customCss: '.swagger-ui .topbar, #operations-tag-default, .scheme-container { display: none; }' };
router.use("/", swaggerUi.serve, (...args) => swaggerUi.setup(doc, opts)(...args));

module.exports = router;