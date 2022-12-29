require("colors")

//error handling middleware
module.exports.defaultErrorHandler = function (err, req, res, next) {
    console.log(`${'errorHandlerMiddleware'.red}: error detected, processing it in error handler:`, err);
    const additionalInfo = (typeof (err) === "string") ? " (" + err + ")" : "";

    if ((err.name === 'UnauthorizedError' && err.code === 'permission_denied') ||
        (err.name === 'UnauthorizedError' && err.code === 'user_object_not_found')) { //permission middleware
        return res.status(401).json({ success: false, message: "Unauthorized" + additionalInfo });
    }

    if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Oops, something went wrong." + additionalInfo });
    }
    else {
        res.json({ success: false, message: "Oops, something went wrong." + additionalInfo });
    }

    next(err);
}
