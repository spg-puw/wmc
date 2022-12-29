const express = require("express");
const router = express.Router();
const guard = require("express-jwt-permissions")();

/**
 * @openapi
 * tags:
 *   - name: news
 *     description: important endpoints for news api
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     APIResponse:
 *       type: object
 *       description: default response json object for api call
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: ok
 *         result:
 *           type: string
 *           example: this can be a string, object or array with strings/objects
 *       required:
 *         - success
 *         - message
 */
const defaultApiResponse = { "success": true, "message": "default", "result": null };

var db = require("../db").connect();

/**
 * @openapi
 * /news:
 *   get:
 *     summary: get news
 *     description: get the news including all details
 *     security: []
 *     tags:
 *       - news
 *     responses:
 *       200:
 *         description: api response data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.get("/", async (req, res, next) => {
    try {
        const r = await db.model.News.findAll({
            attributes: ['id', 'headline', 'content', 'imageurl', ['createdAt', 'published']],
            include: [
                {
                    model: db.model.Comments,
                    attributes: ['id', 'commentText', 'commentTime'],
                    include: {
                        model: db.model.Users,
                        attributes: ['id', 'username'],
                    }
                },
                {
                    model: db.model.Users,
                    attributes: ['id', 'username'],
                }
            ]
        });
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /news:
 *   post:
 *     summary: create new news post
 *     description: create new news post, you need to be admin
 *     tags:
 *       - news
 *     requestBody:
 *       description: content
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               headline:
 *                 type: string
 *                 example: something important
 *               content:
 *                 type: string
 *                 example: lorem ipsum
 *               imageurl:
 *                 type: string
 *                 example: https://image.url/image.jpg
 *             required:
 *               - headline
 *               - content
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       400:
 *         description: bad request parameters
 *       401:
 *         description: authentication error
 */
router.post("/", guard.check(["admin"]), async (req, res, next) => {
    try {
        const headline = req.body.headline;
        const content = req.body.content;
        const imageurl = req.body.imageurl;
        const userId = req.user.userId;

        if (!headline || !content || !userId) {
            return res.status(400).json({ success: false, message: "bad parameters" });
        }
        const newElement = await db.model.News.create({ author_userId: userId, headline: headline, content: content, imageurl: imageurl });
        res.json({ success: true, message: "element created", result: newElement });
    }
    catch (err) {
        if (err.name == 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ success: false, message: "id not found" });
        }

        next(err);
    }
});

/**
 * @openapi
 * /news/{id}:
 *   get:
 *     summary: get a news article
 *     description: get news article including all details
 *     security: []
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the news article
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.get("/:id", async (req, res, next) => {
    try {
        const r = await db.model.News.findAll({
            where: { id: req.params.id },
            attributes: ['id', 'headline', 'content', 'imageurl', ['createdAt', 'published']],
            include: [
                {
                    model: db.model.Comments,
                    attributes: ['id', 'commentText', 'commentTime'],
                    include: {
                        model: db.model.Users,
                        attributes: ['id', 'username'],
                    }
                },
                {
                    model: db.model.Users,
                    attributes: ['id', 'username'],
                }
            ]
        });
        if (!r || r.length <= 0) {
            return res.status(404).json({ success: false, message: "id not found", result: r })
        }
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /news/{id}:
 *   delete:
 *     summary: delete a news article
 *     description: delete news article by id, needs admin permission
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the news article
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       401:
 *         description: authentication error
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.delete("/:id", guard.check(["admin"]), async (req, res, next) => {
    try {
        const r = await db.model.News.destroy({
            where: { id: req.params.id },
        });
        if (!r) {
            return res.status(404).json({ success: false, message: "id not found", result: r })
        }
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /news/{id}/comments:
 *   get:
 *     summary: get comments for article
 *     description: get the comments for a news article
 *     security: []
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the news article
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       401:
 *         description: authentication error
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.get("/:id/comments", async (req, res, next) => {
    try {
        const r = await db.model.Comments.findAll({
            where: { newsId: req.params.id },
            attributes: ['id', 'commentText', 'commentTime'],
            include: {
                model: db.model.Users,
                attributes: ['id', 'username'],
            }
        });
        if (!r || r.length <= 0) {
            return res.status(404).json({ success: false, message: "id not found", result: r })
        }
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /news/{id}/comments:
 *   post:
 *     summary: create a new comment for article
 *     description: create a new comment for article, you need postcomment permission (user account)
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the news article
 *         schema:
 *           type: string
 *           example: 1
 *     requestBody:
 *       description: content
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               commentText:
 *                 type: string
 *                 example: lorem ipsum
 *             required:
 *               - commentText
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       400:
 *         description: bad request parameters
 *       401:
 *         description: authentication error
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.post("/:id/comments", guard.check(["postcomment"]), async (req, res, next) => {
    try {
        const newsId = req.params.id;
        const userId = req.user.userId;
        const commentText = req.body.commentText;

        if (!commentText || !newsId || !userId) {
            return res.status(400).json({ success: false, message: "bad parameters" });
        }
        const newElement = await db.model.Comments.create({ userId: userId, newsId: newsId, commentText: commentText })
        res.json({ success: true, message: "element created", result: newElement });
    }
    catch (err) {
        if (err.name == 'SequelizeForeignKeyConstraintError') {
            return res.status(404).json({ success: false, message: "id not found" });
        }
        next(err);
    }
});

/**
 * @openapi
 * /news/comments/{id}:
 *   get:
 *     summary: get a comment
 *     description: get a comment for a news article
 *     security: []
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the comment (uuid)
 *         schema:
 *           type: string
 *           example: 0f48b232-d09d-45d7-a7f2-7cc303e24eaa
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 */
router.get("/comments/:id", async (req, res, next) => {
    try {
        const r = await db.model.Comments.findAll({
            where: { id: req.params.id },
            attributes: ['id', 'commentText', 'commentTime'],
            include: [
                {
                    model: db.model.Users,
                    attributes: ['id', 'username'],
                },
                {
                    model: db.model.News,
                    attributes: ['id', 'headline', 'content', 'imageurl', ['createdAt', 'published']],
                    include: {
                        model: db.model.Users,
                        attributes: ['id', 'username'],
                    }
                }
            ]
        });
        if (!r || r.length <= 0) {
            return res.status(404).json({ success: false, message: "id not found", result: r })
        }
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

/**
 * @openapi
 * /news/comments/{id}:
 *   delete:
 *     summary: delete comment
 *     description: delete comment, you need to be admin
 *     tags:
 *       - news
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the comment (uuid)
 *         schema:
 *           type: string
 *           example: 0f48b232-d09d-45d7-a7f2-7cc303e24eaa
 *     responses:
 *       200:
 *         description: api response data with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 *       401:
 *         description: authentication error
 *       404:
 *         description: wrong id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/APIResponse'
 * 
 */
router.delete("/comments/:id", guard.check(["admin"]), async (req, res, next) => {
    try {
        const r = await db.model.Comments.destroy({
            where: { id: req.params.id },
        });
        if (!r) {
            return res.status(404).json({ success: false, message: "id not found", result: r })
        }
        res.json({ success: true, message: "ok", result: r });
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;