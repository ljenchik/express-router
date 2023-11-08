const { app, userRouter, fruitRouter } = require("./src/app");
const port = 3000;

app.use("/users", userRouter);
app.use("/fruits", fruitRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
