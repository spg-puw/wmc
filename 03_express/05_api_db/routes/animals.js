const express = require("express");
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: animals
 *     description: important endpoints for animals api
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

//default list of animals - is resetted on server restart
let animals = ['Katze', 'Hund', 'Schwein', 'Kuh', 'Biene', 'Igel', 'Wolf'];

router.get("/new", (req, res) => {
    res.render("animals/newForm");
});

/**
 * @openapi
 * /animals:
 *   get:
 *     summary: get all animals
 *     description: some more info here
 *     security: []
 *     tags:
 *       - animals
 *     responses:
 *       200:
 *         description: animal list
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 *           text/html:
 *             schema:
 *               type: string
 */
router.get("/", (req, res) => {
    if (req.accepts('html')) {
        //render as html
        res.render("animals/index", {
            animals: animals,
        });
    }
    else {
        //reply with json
        const r = { ...defaultApiResponse };
        r.message = "list of all animals";
        r.result = animals;
        res.json(r);
    }
});

/**
 * @openapi
 * /animals:
 *   post:
 *     summary: create new animal
 *     description: some more info here
 *     security: []
 *     tags:
 *       - animals
 *     requestBody:
 *       description: animal data
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               animalname:
 *                 type: string
 *                 description: name of the animal
 *                 example: 'Fledermaus'
 *             required:
 *               - animalname
 *     responses:
 *       200:
 *         description: animal data
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 */
router.post("/", (req, res) => {
    const r = { ...defaultApiResponse };
    const newAnimalName = req.body.animalname;

    if (newAnimalName) {
        //add new animal to list - this will be reset when you restart the server!
        animals.push(String(newAnimalName));

        r.message = "added new animal";
        r.result = newAnimalName;
    }
    else {
        r.success = false;
        r.message = "could not add new animal without a name";
    }
    
    res.json(r);
});

/**
 * @openapi
 * /animals/{id}:
 *   get:
 *     summary: get animal
 *     description: some more info here
 *     security: []
 *     tags:
 *       - animals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of animal
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: animal data
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
*/
router.get("/:id", (req, res) => {
    const r = { ...defaultApiResponse };
    const idParam = req.params.id;

    if (animals[idParam]) {
        r.message = "ok";
        r.result = animals[idParam];
    }
    else {
        r.success = false;
        r.message = "could not find this animal";
    }
    
    res.json(r);
});

/**
 * @openapi
 * /animals/{id}:
 *   delete:
 *     summary: delete an animal
 *     description: some more info here
 *     security: []
 *     tags:
 *       - animals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of animal
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: animal data
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/APIResponse'
 */
router.delete("/:id", (req, res) => {
    const r = { ...defaultApiResponse };
    const idParam = req.params.id;

    const animalToDelete = animals[idParam];
    if (animalToDelete) {
        animals.splice(idParam, 1);

        r.message = "deleted animal";
        r.result = animalToDelete;
    }
    else {
        r.success = false;
        r.message = "could not delete this animal";
    }
    
    res.json(r);
});

module.exports = router;