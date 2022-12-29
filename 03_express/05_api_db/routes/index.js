const express = require("express");
const router = express.Router();

const authMiddleware = require("../lib/authMiddleware");

const defaultRoute = require("./defaultRoute.js");
const animals = require("./animals");
const auth = require("./auth");
const news = require("./news");
const openapiDoc = require("./openapi-doc");

router.use("/animals", animals);

router.use(authMiddleware);

router.use("/auth", auth);
router.use("/news", news);
router.use("/doc", openapiDoc);
router.use("/", defaultRoute);

module.exports = router;