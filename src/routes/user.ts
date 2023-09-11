import express from "express";
import { createUser, getUsers } from "../controllers/user.controller";
import { withSession } from "../controllers/auth.controller";

const router = express();

router.get("/", withSession, getUsers)
router.post("/", createUser)

export { router as UserRouter };