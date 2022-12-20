const express = require("express");
const router = express.Router();

const defaultRoute = require("./defaultRoute.js");
const animals = require("./animals");
const openapiDoc = require("./openapi-doc");

router.use("/animals", animals);
router.use("/doc", openapiDoc);
router.use("/", defaultRoute);

module.exports = router;