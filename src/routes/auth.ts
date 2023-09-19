import express, { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations";
import { login, logout, me, register, withSession } from "../controllers/auth.controller";
import { rateLimit } from "express-rate-limit";
import { logger } from "../server";

const router = express();

//Logger
router.use((req: Request, res: Response, next: NextFunction) => {
    logger.log("info", `[auth] received ${req.method} request for ${req.url} from ${req.hostname}`)

    res.on("finish", () => {
        logger.log("info", `[auth] finished ${req.method} request for ${req.url}: ${res.statusCode} ${res.statusMessage}`)
    })

    next();
})

router.get("/me", withSession, me)
router.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20, //20 requests per minute
    standardHeaders: "draft-7",
    legacyHeaders: false
}))
router.post("/login", [...loginSchema], login)
router.post("/register", [...registerSchema], register)
router.post("/logout", withSession, logout)

export { router as AuthRouter };
