import express from "express";

import prisma from "../Clients/PrismaClient";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const BooksRouter = express.Router();

BooksRouter.post("/", AuthMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.body.user.id } });

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role < 2) return res.status(403).json({ message: "You are not an administrator" });

    const { title, author, publicationDate, genres } = req.body;

    if (!title || !author || !genres) return res.status(400).json({ message: "All fields are required" });

    const newBook = await prisma.book.create({
        data: {
            title: title,
            author: author,
            genres: genres,
            publicationDate: publicationDate,
        },
    });

    return res.status(201).json(newBook);
});

BooksRouter.get("/", async (req, res) => {
    return res.status(200).json(await prisma.book.findMany({}));
});

BooksRouter.get("/:id", async (req, res) => {
    return res.status(200).json(await prisma.book.findUnique({ where: { id: Number(req.params.id) } }));
});

BooksRouter.put("/:id", AuthMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.body.user.id } });
    const id = Number(req.params.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role < 2) return res.status(403).json({ message: "You are not an administrator" });

    const { title, author, publicationDate, genres } = req.body;

    if (!title || !author || !publicationDate || !genres) return res.status(400).json({ message: "All fields are required" });

    let book = await prisma.book.findUnique({ where: { id } });

    if (!book) return res.status(404).json({ message: "Book not found" });

    book = await prisma.book.update({
        where: { id },
        data: {
            title: title,
            author: author,
            genres: genres,
            publicationDate: publicationDate,
        },
    });

    return res.status(202).json(book);
});

BooksRouter.delete("/:id", AuthMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.body.user.id } });

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role < 2) return res.status(403).json({ message: "You are not an administrator" });

    await prisma.book.delete({ where: { id: Number(req.params.id) } });

    return res.sendStatus(200);
});

export default BooksRouter;
