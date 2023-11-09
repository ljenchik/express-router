const request = require("supertest");
const { app } = require("./src/app");
const { syncSeed } = require("./seed");
const { User, Fruit } = require("./models/index");
let quantity;
let fruitQuantity;

describe("Tests users endpoints", () => {
    beforeAll(async () => {
        await syncSeed();
        const allUsers = await User.findAll();
        quantity = allUsers.length;
    });
    test("tets GET /users endpoint", async () => {
        const response = await request(app).get("/users");
        //console.log(JSON.stringify(response, null, 2));
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Array).toEqual(true);
        expect(response.body.length).toEqual(quantity);
        expect(response.body[0]).toHaveProperty("age");
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "User 1",
                age: 30,
            })
        );
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "User 2",
                age: 45,
            })
        );
    });

    test("tets GET /users/:id endpoint", async () => {
        const id = 4;
        const response = await request(app).get(`/users/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Object).toEqual(true);
        expect(response.body).toHaveProperty("age");
        expect(response.body).toEqual(
            expect.objectContaining({ id: 4, name: "User 4", age: 22 })
        );
    });

    test("tests POST /users endpoint", async () => {
        const response = await request(app).post("/users").send({
            name: "Chris",
            age: 38,
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(quantity + 1);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "Chris",
                age: 38,
            })
        );
    });

    test("tests PUT /users/:id endpoint", async () => {
        const id = 1;
        const response = await request(app).put(`/users/${id}`).send({
            name: "AnnaB",
            age: 25,
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(quantity + 1);
        const foundUser = await User.findByPk(id);
        expect(foundUser.name).toEqual("AnnaB");
    });

    test("tests DELETE /users/:id endpoint", async () => {
        const id = 1;
        const response = await request(app).delete(`/users/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(quantity);
        const users = await User.findAll();
        expect(users.length).toBe(quantity);
        expect(users[0].id).not.toEqual(1);
    });
});

describe("Tests fruits endpoints", () => {
    beforeAll(async () => {
        await syncSeed();
        const allFruit = await User.findAll();
        fruitQuantity = allFruit.length;
    });
    test("tets GET /fruits endpoint", async () => {
        const response = await request(app).get("/fruits");
        //console.log(JSON.stringify(response, null, 2));
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Array).toEqual(true);
        expect(response.body.length).toEqual(fruitQuantity);
        expect(response.body[0]).toHaveProperty("color");
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "Grape",
                color: "Purple",
            })
        );
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "Kiwi",
                color: "Green",
            })
        );
    });

    test("tets GET /fruits/:id endpoint", async () => {
        const id = 4;
        const response = await request(app).get(`/fruits/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body instanceof Object).toEqual(true);
        expect(response.body).toHaveProperty("color");
        expect(response.body).toEqual(
            expect.objectContaining({ id: 4, name: "Grape", color: "Purple" })
        );
    });

    test("tests POST /fruits endpoint", async () => {
        const response = await request(app).post("/fruits").send({
            name: "Cherry",
            color: "Dark red",
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(fruitQuantity + 1);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                name: "Cherry",
                color: "Dark red",
            })
        );
    });

    test("tests PUT /fruits/:id endpoint", async () => {
        const id = 1;
        const response = await request(app).put(`/fruits/${id}`).send({
            name: "Tomato",
            color: "Red",
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(fruitQuantity + 1);
        const foundFruit = await Fruit.findByPk(id);
        expect(foundFruit.name).toEqual("Tomato");
    });

    test("tests DELETE /fruits/:id endpoint", async () => {
        const id = 2;
        const response = await request(app).delete(`/fruits/${id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(fruitQuantity);
        const fruits = await Fruit.findAll();
        expect(fruits.length).toBe(fruitQuantity);
        expect(fruits[1].id).not.toEqual(2);
    });
});

describe("tests that error is returned, when adding data with missing properties", () => {
    beforeAll(async () => {
        await syncSeed();
        const allFruit = await User.findAll();
        fruitQuantity = allFruit.length;
    });
    test("tests user's missing name field, should return error", async () => {
        const response = await request(app).post("/users").send({ age: 26 });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
    });
    test("tests fruit's missing colour field, should return error", async () => {
        const response = await request(app)
            .post("/fruits")
            .send({ name: "Melon" });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
        expect(response.body.error).toEqual([
            {
                msg: "Invalid value",
                param: "color",
                location: "body",
            },
        ]);
    });

    test("tests the length of name in user, too short", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "John", age: 26 });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
    });
    test("tests the length of name in user, too long", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "Johnnnnnnn   nnnnn kkjkjkasd", age: 26 });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
    });

    test("tests the length of name in fruit, too short", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "Apl", color: "Pink" });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
    });
    test("tests the length of name in user, too long", async () => {
        const response = await request(app)
            .post("/users")
            .send({ name: "Appleeee asdadadffdwf", color: "Red" });
        expect(response.body).toHaveProperty("error");
        expect(Array.isArray(response.body.error)).toBe(true);
    });
});
