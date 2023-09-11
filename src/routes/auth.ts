import express from "express";
import { loginSchema, registerSchema } from "../validations";
import { login, logout, me, register, withSession } from "../controllers/auth.controller";
import { rateLimit } from "express-rate-limit";

const router = express();

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
