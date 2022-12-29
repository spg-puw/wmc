require("colors")

// custom logging middleware
module.exports = function (req, res, next) {
    console.log(`${'customLoggingMiddleware'.red}: A new request received at ${Date.now()}`);
    next();
};