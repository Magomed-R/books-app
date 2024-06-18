import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

import prisma from "../client";
import mailer from "../mailer";
import getText from "../entities/mail-text";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const { JWT_SECRET, MAIL_USER, DOMAIN } = process.env;

const UsersRouter = express.Router();

UsersRouter.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) return res.status(400).json({ message: "All fields are required" });

    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return res.status(403).json({ message: "Invalid mail" });

    const userByEmail = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (userByEmail !== null) return res.status(409).json({ message: "User with this email already exists" });

    const userByUsername = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (userByUsername !== null) return res.status(409).json({ message: "User with this username already exists" });

    const hash = await bcrypt.hash(password, 7);

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hash,
            email,
        },
    });

    const code = crypto.randomBytes(8).toString("hex");

    const checkMail = await prisma.checkMail.create({
        data: {
            code: code,
            userId: newUser.id,
        },
    });

    try {
        await mailer.sendMail({
            to: email,
            subject: "Добро пожаловать в Books App",
            from: MAIL_USER,
            html: getText(checkMail.id, code, DOMAIN!),
        });
    } catch {
        await prisma.user.delete({
            where: {
                id: newUser.id,
            },
        });

        return res.status(403).json({ message: "Invalid mail" });
    }

    return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        password: password,
        role: newUser.role,
        verifid: newUser.verifid,
        email: newUser.email,
    });
});

UsersRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (user === null) return res.status(404).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) return res.status(403).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET!);

    return res.status(200).json({ access_token: token });
});

UsersRouter.get("/verify", async (req, res) => {
    const { id, code } = req.query;

    const checkMail = await prisma.checkMail.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!checkMail) return res.status(404).json({ message: "Verification code not found" });

    if (checkMail.code !== code) return res.status(403).json({ message: "Incorrect code" });

    await prisma.user.update({
        where: {
            id: checkMail.userId,
        },
        data: {
            verifid: true,
        },
    });

    return res.status(200).json({ message: "Verification passed" });
});

UsersRouter.get("/me", AuthMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.body.user.id },
        select: {
            username: true,
            password: false,
            email: true,
            id: true,
            role: true,
            verifid: true,
        },
    });

    return res.status(200).json(user);
});

UsersRouter.put("/:id/role", AuthMiddleware, async (req, res) => {
    const admin = await prisma.user.findUnique({
        where: {
            id: req.body.user.id,
        },
    });

    if (admin!.role < 2) return res.status(403).json({ message: "You are not an administrator" });

    let user = await prisma.user.findUnique({
        where: {
            id: Number(req.params.id),
        },
        select: {
            username: true,
            password: false,
            email: true,
            id: true,
            role: true,
            verifid: true,
        },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    user = await prisma.user.update({
        where: {
            id: Number(req.params.id),
        },
        data: {
            role: 2,
        },
        select: {
            username: true,
            password: false,
            email: true,
            id: true,
            role: true,
            verifid: true,
        },
    });

    return res.status(200).json(user);
});

export default UsersRouter;
