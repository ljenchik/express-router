const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const { Fruit } = require("./../models");
const fruitRouter = Router();

fruitRouter.get("/", async (req, res) => {
    const allFruit = await Fruit.findAll();
    res.json(allFruit);
});

fruitRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const fruit = await Fruit.findByPk(id);
    res.json(fruit);
});

fruitRouter.post("/", [check("color").not().isEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
    } else {
        await Fruit.create(req.body);
        const allFruit = await Fruit.findAll();
        res.json(allFruit);
    }
});

fruitRouter.put("/:id", async (req, res) => {
    const id = req.params.id;
    const fruit = await Fruit.findByPk(id);
    await fruit.update(req.body);
    const allFruit = await Fruit.findAll();
    res.json(allFruit);
});

fruitRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const fruit = await Fruit.findByPk(id);
    await fruit.destroy();
    const allFruit = await Fruit.findAll();
    res.json(allFruit);
});

module.exports = fruitRouter;
