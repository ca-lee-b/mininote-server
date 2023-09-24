import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

//Middleware
export async function withSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.cookies["session"];
  if (!id) return res.status(400).send("Unauthorized");

  const session = await prisma.session.findFirst({
    where: {
      id,
    },
    include: {
      user: true
    }
  });

  if (!session) {
    res.clearCookie("session");
    res.status(400).send("Unauthorized");
    
    return;
  }
  if (new Date() > session.expiry) { 
    await prisma.session.delete({
      where: {
        id
      }
    })
    return res.status(400).send("Unauthorized");
  }
  //@ts-ignore
  req.user = session.user;
  return next();
}

//The rest

export async function me(req: Request, res: Response) {
  const session = await prisma.session.findFirst({
    where: {
      id: req.cookies["session"],
    },
  });
  if (!session) return res.status(500).send("Internal Server Error");

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });
  if (!user) return res.status(500).send("Internal Server Error");

  const { password, id, ...data } = user;

  return res.status(200).send(data);
}

export async function logout(req: Request, res: Response) {
  const success = await prisma.session.deleteMany({
    where: {
      id: req.cookies["session"],
    },
  });

  if (!success) return res.status(500).send("Internal Server Error");

  res.clearCookie("session");

  return res.status(200).send("Success");
}

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.formatWith((e) => e.msg as string);
    return res.status(400).send(formatted.array());
  }

  //Ensure user does NOT exist
  const userExists = await prisma.user.findUnique({
    where: {
      email: req.body.email.toLowerCase(),
    },
  });
  if (userExists) return res.status(400).send("User Already Exists");

  const password = await bcrypt.hash(req.body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: req.body.email.toLowerCase(),
      username: req.body.username,
      password,
    },
  });
  if (!user) return res.status(500).send("Internal Server Error");

  res.status(201).send("Success");
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.formatWith((e) => e.msg as string);
    return res.status(400).send(formatted.array());
  }

  //Ensure user does exist
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email.toLowerCase(),
    },
  });

  if (!user) return res.status(400).send("Bad Request");

  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) return res.status(401).send("Unauthorized");

  //Update session if exists (and return)
  if (req.cookies["session"]) {
    const sessionExists = await prisma.session.findUnique({
      where: {
        id: req.cookies["session"],
      },
    });
    if (sessionExists) {
      let now = new Date()
      const expiry = now.setDate(now.getDate() + 30)
      await prisma.session.update({
        where: {
          id: sessionExists.id,
        },
        data: {
          expiry: new Date(expiry),
        },
      });
      return res.status(200).send("Success");
    }
  }

  //Create session
  let now = new Date()
  const expiry = now.setDate(now.getDate() + 30)
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiry: new Date(expiry),
    },
  });
  if (!session) return res.status(500).send("Internal Server Error");

  res.cookie("session", session.id, {
    maxAge: new Date(expiry).getTime(),
    expires: new Date(expiry),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).send("Success");
}
