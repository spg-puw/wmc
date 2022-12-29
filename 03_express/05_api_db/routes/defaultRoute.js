const express = require("express");
const router = express.Router();

//standard route
router.get("/", (req, res) => {
    res.render("index");
});

//fallback route
router.all("*", (req, res) => {
    res.status(404).send("invalid url");
});

module.exports = router;