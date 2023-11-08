const request = require("supertest");
const { app } = require("./src/app");
const { syncSeed } = require("./seed");
const { User, Fruits } = require("./models/index");
let quantity;

describe("Tests user endpoints", () => {
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
            name: "Anna",
            age: 25,
        });
        //console.log(response.body);
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toEqual(quantity + 1);
        const foundUser = await User.findByPk(id);
        expect(foundUser.name).toEqual("Anna");
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
