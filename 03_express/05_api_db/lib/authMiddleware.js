const express = require("express");
const router = express.Router();
var { expressjwt } = require("express-jwt");
require("colors");
const getJwtTokenFromReq = require("../lib/helpers").getJwtTokenFromReq;

router.use(expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    audience: process.env.JWT_AUD,
    issuer: process.env.JWT_ISS,
    requestProperty: "user", //jwt data will be stored in req.user
    credentialsRequired: false, //do not throw error when token not present - just identify user; throws error when troken wrong!
    getToken: (req) => {
        const token = getJwtTokenFromReq(req);
        if (token) {
            console.log(`${'authMiddleware'.red}: found jwt token, use it for further processing`)
        }
        return token;
    },
}), function (err, req, res, next) { //jwt error handler
    if (err.name === 'UnauthorizedError') {
        console.error(`${'authMiddleware'.red}: error in jwt: ${err.message}`);
        return res.status(401).json({ success: false, message: "Unauthorized", result: err.message});
    }
    next(err);
});

//add token to req.user object
router.use((req, res, next) => {
    if (req.user) {
        const token = getJwtTokenFromReq(req);
        req.user.jwtToken = token;
    }
    else {
        req.user = { permissions: [] };
    }
    next();
});

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     jwtKey:
 *       type: apiKey
 *       description: The **JWT token** for requests in the query string
 *       name: _jwt
 *       in: query
 *     jwtToken:
 *       type: http
 *       scheme: bearer
 *       description: JWT token in Auth header
 */

module.exports = router;