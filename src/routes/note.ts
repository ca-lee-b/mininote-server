import express from "express";
import { withSession } from "../controllers/auth.controller";
import { createNote, deleteNote, getNotes, getOneNote, updateNote } from "../controllers/note.controller";
import { createNoteSchema } from "../validations";

const router = express();

router.get("/", withSession, getNotes)
router.get("/:id", withSession, getOneNote)
router.post("/", withSession, [...createNoteSchema], createNote)
router.delete("/:id", withSession, deleteNote)
router.post("/:id", withSession, updateNote)
export { router as NoteRouter };