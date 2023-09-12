import express, { NextFunction, Request, Response } from "express";
import { createUser, getUsers } from "../controllers/user.controller";
import { withSession } from "../controllers/auth.controller";
import { logger } from "src/server";

const router = express();

//Logger
router.use((req: Request, res: Response, next: NextFunction) => {
    logger.log("info", `[user] received ${req.method} request for ${req.url}`)

    res.on("finish", () => {
        logger.log("info", `[user] finished ${req.method} request for ${req.url}: ${res.statusCode} ${res.statusMessage}`)
    })

    next();
})

router.get("/", withSession, getUsers)
router.post("/", createUser)

export { router as UserRouter };