require("colors")

// custom logging middleware
module.exports = function (req, res, next) {
    if (process.env.NODE_ENV == "development") {
        console.log(`${'customLoggingMiddleware'.red}: A new request received at ${Date.now()}`);
    }
    next();
};