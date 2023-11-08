const { Router } = require("express");
const { User } = require("./../models");

const userRouter = Router();

userRouter.get("/", async (req, res) => {
    const allUsers = await User.findAll();
    res.json(allUsers);
});

userRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.json(user);
});

userRouter.post("/", async (req, res) => {
    await User.create(req.body);
    const allUsers = await User.findAll();
    res.json(allUsers);
});

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
