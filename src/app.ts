import express from "express";
import bodyParser from "body-parser";
import { green } from "chalk";

import BooksRouter from "./Routers/BooksRouter";
import UsersRouter from "./Routers/UsersRouter";

const { PORT } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/books", BooksRouter);
app.use("/users", UsersRouter);

app.listen(PORT, () => console.log(green.bold(`Server started on port ${PORT}`)));
