const express = require("express");
const { check, validationResult } = require("express-validator");
const { User } = require("./../models");
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
});

userRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.json(user);
});

userRouter.post(
    "/",
    [check("name").not().isEmpty().trim()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ error: errors.array() });
        } else {
            await User.create(req.body);
            const allUsers = await User.findAll();
            res.json(allUsers);
        }
    }
);

userRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    await user.update(req.body);
    const allUsers = await User.findAll();
    res.json(allUsers);
});

userRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    await user.destroy();
    const allUsers = await User.findAll();
    res.json(allUsers);
});

module.exports = userRouter;
