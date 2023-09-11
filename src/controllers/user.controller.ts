import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { type Request, type Response } from "express";

export async function createUser(req: Request, res: Response) {
  const data = req.body;
  const password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email.toLowerCase(),
      password,
    },
  });

  if (!user) return res.send("Internal Server Error").status(500);

  return res.send(user).status(201);
}

export async function getUsers(req: Request, res: Response) {
  let users = await prisma.user.findMany();
  let cleanedList = [];
  for (let user of users) {
    const { password, ...data } = user;
    cleanedList.push({ ...data });
  }

  return res.send(cleanedList).status(200);
}
