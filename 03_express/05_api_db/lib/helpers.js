const entities = require('html-entities');
const createHash = require('crypto').createHash;
const jwt = require("jsonwebtoken");

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports.omit = (obj, key) => { const { [key]: ignore, ...rest } = obj; return rest; }

module.exports.hash = (cleartext, salt) => {
    salt = salt ?? process.env.HASH_SALT ?? 'someUNSAFEsalt'; //salt can optionally be overwritten, which *should* be done for every user

    const hashIdentifier = '$6$';
    const digestion = 'hex' //hex or base64

    const iterations = Math.min(process.env.HASH_ITERATIONS ?? 100_000,100_000) //we hash >= 100.000 times

    let current_hash = salt + cleartext //we only add the salt one time, as the hash could be predicted if we do it every iteration

    for(let iteration=0;iteration<iterations;iteration++) {
        current_hash = createHash('sha512').update(current_hash).digest(digestion) //we continously hash (iterations) times
    }

    return hashIdentifier + current_hash;
}

module.exports.generateJwtToken = (userId, permissions) => {
    var payload = {
        userId: userId,
        //scope: permissions.join(" "),
        permissions: permissions,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET ?? "somethingsecret", { expiresIn: '28d', audience: process.env.JWT_AUD ?? "audience", issuer: process.env.JWT_ISS ?? "issuer" });
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