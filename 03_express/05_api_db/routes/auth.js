const express = require("express");
const router = express.Router();
const guard = require("express-jwt-permissions")();
const generateJwtToken = require("../lib/helpers").generateJwtToken;
const hash = require("../lib/helpers").hash;

/**
 * @openapi
 * tags:
 *   - name: auth
 *     description: authentication and login endpoints
 */

var db = require("../db").connect();

router.get("/login", (req, res) => {
    res.render("auth/loginForm");
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: login with username and password
 *     description: log in and get jwt token
 *     security: []
 *     tags:
 *       - auth
 *     parameters:
 *       - in: header
 *         name: Accept
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - application/json
 *             - text/html
 *         default: application/json
 *     requestBody:
 *       description: login credentials
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: user1
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: api response data
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 *           text/html:
 *             schema:
 *               type: string
 *       302:
 *         description: login and redirect
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: authentication error
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 */
router.post("/login", async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await db.model.Users.findOne({
            where: {
                [db.Sequelize.Op.and]: [
                    { username: username },
                    { password: hash(password) },
                ],
            },
        });
        if (req.accepts('html')) {
            if (user) {
                const jwt = generateJwtToken(user.id, user.isAdmin ? ['admin', 'postcomment'] : ['postcomment']);
                res.redirect(`user?_jwt=${jwt}`);
            }
            else {
                res.redirect("login");
            }
        }
        else {
            if (user) {
                const jwt = generateJwtToken(user.id, user.isAdmin ? ['admin', 'postcomment'] : ['postcomment']);
                res.json({success: true, message: "ok", result: { id: user.id, username: user.username, avatarUrl: user.avatarUrl, jwtToken: jwt }});
            }
            else {
                res.status(401).json({success: false, message: "wrong credentials"});
            }
        }
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /auth/user:
 *   get:
 *     summary: get user details
 *     description: get the user details for a user that has permission
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       302:
 *         description: no authentication found and redirect to login page
 *       401:
 *         description: authentication error
 */
router.get("/user", async (req, res, next) => {
    try {
        if ((req.user && req.user.userId)) {
            const userId = req.user.userId;
            const user = await db.model.Users.findOne({ where: { id: userId }, });
            if (req.accepts('html')) {
                res.render("auth/loginLandingPage", { user: user, reqUser: req.user });
            }
            else {
                res.json({success: true, message: "ok", result: { id: user.id, username: user.username, avatarUrl: user.avatarUrl, permissions: req.user.permissions, jwtToken: req.user.jwtToken }});
            }
        }
        else {
            res.redirect("login");
        }
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /auth/getPermissions:
 *   get:
 *     summary: get permissions
 *     description: get the permissions for current user
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: api response data with permissions
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 */
router.get("/getPermissions", (req, res) => {
    var permissions = [];
    if (req.user && req.user.permissions) {
        permissions = req.user.permissions;
    }
    res.send({ success: true, message: "ok", result: permissions });
});

module.exports = router;