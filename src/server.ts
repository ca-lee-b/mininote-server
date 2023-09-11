import express, { type Request, type Response, type Application, json } from "express";
import { UserRouter } from "./routes/user";
import { AuthRouter } from "./routes/auth";
import cookieParser from "cookie-parser"
import cors from "cors";
import { NoteRouter } from "./routes/note";

export function bootstrap(): Application {
    const app = express();

    app.use(json())
    app.use(cookieParser());
    app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true, allowedHeaders: ["Content-Type", "Cookie"], methods: ["GET", "POST", "DELETE", "PUT"] }))

    app.use("/", AuthRouter)
    app.use("/users", UserRouter)
    app.use("/notes", NoteRouter);

    return app;
}