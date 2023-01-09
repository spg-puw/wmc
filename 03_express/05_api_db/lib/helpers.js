const entities = require('html-entities');
const createHash = require('node:crypto').createHash; //old: npm i crypto; require("crypto")
const jwt = require("jsonwebtoken");

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports.omit = (obj, key) => { const { [key]: ignore, ...rest } = obj; return rest; }

module.exports.hash = (cleartext) => {
    const hashIdentifier = '$6$';
    const salt = process.env.HASH_SALT ?? 'salt';
    return hashIdentifier + createHash('sha512').update(salt + cleartext).digest('hex');
}

module.exports.generateJwtToken = (userId, permissions) => {
    var payload = {
        userId: userId,
        //scope: permissions.join(" "),
        permissions: permissions,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '28d', audience: process.env.JWT_AUD, issuer: process.env.JWT_ISS });
    return token;
}

//get token from Authorization header or query parameter ?_jwt=
module.exports.getJwtTokenFromReq = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query._jwt) {
        return req.query._jwt;
    }
    return null;
}

//extend String.prototype.nl2br
if (!global.String.prototype.nl2br) {
    global.String.prototype.nl2br = function (str) {
        var s = str || this;
        return s.replace(/\r|\n|\r\n/g, '<br />')
    }
}

//extend String.prototype.htmlspecialchars
if (!global.String.prototype.htmlspecialchars) {
    global.String.prototype.htmlspecialchars = function (str) {
        var s = str || this;
        return entities.encode(s);
    }
}