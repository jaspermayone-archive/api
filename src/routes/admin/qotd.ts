import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";

import Qotd from "../../models/Qotd";
/**
 * @swagger
 * /admin/qotd/{id}:
 *    get:
 *      tags:
 *        - /admin
 *      summary: Fetch a qotd by id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the qotd to fetch
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: "#/definitions/Qotd"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;
    Qotd.findById(id, (err, qotd) => {
        if (err) {
            res.status(500).send("An error has occured. Please contact a developer.");
        } else {
            res.json(qotd);
        }
    });
});

/**
 * @swagger
 * /admin/qotd/add:
 *    post:
 *      tags:
 *        - /admin
 *      summary: Add a qotd
 *      parameters:
 *        - in: header
 *          name: qotd
 *          description: Qotd to add
 *          required: true
 *          schema:
 *            $ref: '#/definitions/Qotd'
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            type: "object"
 *            properties:
 *              _id:
 *                type: string
 *              qotd:
 *                type: string
 *              dateUploaded:
 *                type: string
 *                format: date
 *        400:
 *          description: Bad Request
 *          schema:
 *            type: string
 *            example: "Qotd already exists in system!"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.post("/add", async (req, res) => {
    const rawQotd = req.body.qotd;

    const qotdExists = await Qotd.findOne({ qotd: rawQotd });
    if (qotdExists) return res.status(400).send("Qotd already exists in system!");

    const qotd = new Qotd({
        _id: uuidv4(),
        qotd: rawQotd,
    });

    try {
        const newQotd = await qotd.save();
        res.send({
            qotd: newQotd.qotd,
            _id: newQotd._id,
            dateUploaded: newQotd.dateUploaded,
        });
    } catch (err) {
        res.status(500).send("An error has occured. Please contact a developer.");
    }
});

/**
 * @swagger
 * /admin/qotd/{id}:
 *    put:
 *      tags:
 *        - /admin
 *      summary: Find a qotd by id and update it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the qotd to find and update
 *          schema:
 *            type: integer
 *            required: true
 *        - in: header
 *          name: qotd
 *          schema:
 *            type: string
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: "#/definitions/Qotd"
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Qotd.findByIdAndUpdate(id, body, (err, qotd) => {
        if (err) {
            res.status(500).send("An error has occured. Please contact a developer.");
        } else {
            res.json(qotd);
        }
    });
});

/**
 * @swagger
 * /admin/qotd/{id}:
 *    delete:
 *      tags:
 *        - /admin
 *      summary: Find a qotd by id and delete it
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Numeric ID of the qotd to find and delete
 *          schema:
 *            type: integer
 *            required: true
 *      produces: application/json
 *      responses:
 *        200:
 *          description: Successful Response
 *          schema:
 *            $ref: '#/definitions/Qotd'
 *        401:
 *          description: Unauthorized (No token provided)
 *        500:
 *          description: Internal Server Error
 */
router.delete("/:id", (req, res) => {
    Qotd.findByIdAndDelete(req.params.id, (err, qotd) => {
        if (err) {
            res.status(500).send("An error has occured. Please contact a developer.");
        } else {
            res.json(qotd);
        }
    });
});

export default router;