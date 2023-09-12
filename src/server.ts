import express, { type Request, type Response, type Application, json } from "express";
import { UserRouter } from "./routes/user";
import { AuthRouter } from "./routes/auth";
import cookieParser from "cookie-parser"
import cors, { CorsOptions } from "cors";
import { NoteRouter } from "./routes/note";
import winston from "winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss"}),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
    ]
})

export function bootstrap(): Application {
    const app = express();

    const corsOptions: CorsOptions = { origin: "http://localhost:3000", credentials: true, allowedHeaders: ["Content-Type", "Cookie", "Accept", "Origin", "Authorization"], methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }

    app.use(cors(corsOptions))
    app.options("*", cors(corsOptions))
    app.use(json())
    app.use(cookieParser());

    app.use("/", AuthRouter)
    logger.log("info", "auth router mounted")
    app.use("/users", UserRouter)
    logger.log("info", "user router mounted")
    app.use("/notes", NoteRouter);
    logger.log("info", "note router mounted")

    return app;
}