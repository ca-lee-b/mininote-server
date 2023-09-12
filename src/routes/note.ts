import express, { NextFunction, Request, Response } from "express";
import { withSession } from "../controllers/auth.controller";
import { createNote, deleteNote, getNotes, getOneNote, updateNote } from "../controllers/note.controller";
import { createNoteSchema } from "../validations";
import { logger } from "..//server";

const router = express();

//Logger
router.use((req: Request, res: Response, next: NextFunction) => {
    logger.log("info", `[note] received ${req.method} request for ${req.url}`)

    res.on("finish", () => {
        logger.log("info", `[note] finished ${req.method} request for ${req.url}: ${res.statusCode} ${res.statusMessage}`)
    })

    next();
})

router.get("/", withSession, getNotes)
router.get("/:id", withSession, getOneNote)
router.post("/", withSession, [...createNoteSchema], createNote)
router.delete("/:id", withSession, deleteNote)
router.post("/:id", withSession, updateNote)
export { router as NoteRouter };