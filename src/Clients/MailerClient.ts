import nodemailer from "nodemailer";

const { MAIL_USER, MAIL_PASSWORD } = process.env;

const mailer = nodemailer.createTransport({
    service: "mail.ru",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
    },
});

export default mailer;
