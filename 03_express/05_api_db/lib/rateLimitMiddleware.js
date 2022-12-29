require("colors")
const { RateLimiterMemory, BurstyRateLimiter } = require('rate-limiter-flexible');

const burstyLimiter = new BurstyRateLimiter(
    new RateLimiterMemory({
        points: 5,
        duration: 1,
    }),
    new RateLimiterMemory({
        keyPrefix: 'burst',
        points: 20,
        duration: 10,
    })
);

const rateLimitMiddleware = (req, res, next) => {
    burstyLimiter.consume(req.ip)
        .then((rlRes) => {
            // console.log(rlRes)
            next();
        })
        .catch((rej) => {
            console.log(`${'rateLimitMiddleware'.red}: too many requests - ${JSON.stringify(rej)}`);
            res.status(429).end("too many requests");
        });
};

module.exports = rateLimitMiddleware;