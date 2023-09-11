import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getNotes(req: Request, res: Response) {
    const token = req.cookies["session"]
    if (!token) return res.status(400);

    const session = await prisma.session.findFirst({
        where: {
            id: token,
        }
    })

    const user = await prisma.user.findUnique({ 
        where: {
            id: session?.userId
        }, 
        include: {
           note: true
        }
    })

    res.send(user?.note).status(200);
}

export async function getOneNote(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(404).send("Not Found")


    const note = await prisma.note.findUnique({
        where: {
            id,
        }
    })

    if (!note) return res.status(404).send("Not Found")

    res.send(note).status(200);
}

export async function updateNote(req: Request, res: Response) {
    const id = req.params.id;
    if (!req.body["body"]) return res.status(400).send("Bad Request")
    if (!id) return res.status(400).send("Bad Request")

    const note = await prisma.note.findUnique({
        where: {
            id,
        }
    })
    if (!note) return res.status(400).send("Not Found")

    const updatedNote = await prisma.note.update({
        where: {
            id: note.id,
        },
        data: {
            body: req.body["body"],
            title: req.body["title"] ? req.body["title"] : note.title,
            updatedAt: new Date()
        }
    })

    return res.status(200).send(updatedNote)
}

export async function createNote(req: Request, res: Response) {
    if (!req.body["title"]) return res.status(400).send("Title Required")

    const note = await prisma.note.create({
        data: {
            title: req.body["title"],
            //@ts-ignore
            authorId: req.user.id,
            updatedAt: new Date(),
            body: "",
            createdAt: new Date(),
        }
    })

    if (!note) return res.status(500).send("Internal Server Error");

    return res.status(200).send(note);
}

export async function deleteNote(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).send("Bad Request")

    const note = await prisma.note.delete({
        where: {
            id,
            //@ts-ignore
            authorId: req.id
        }
    })

    if (!note) return res.status(500).send("Internal Server Error")

    return res.status(200).send("Success")
}