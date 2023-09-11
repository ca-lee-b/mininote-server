import { body, check } from "express-validator";

export const loginSchema = [
    check("email", "Email must be an email").isEmail(),
]

export const registerSchema = [
    check("email", "Email must be an email").isEmail(),
    check("username", "Username must be between 4 and 20 characters").isLength({ min: 4, max: 20}),
    check("password", "Password must be between 7 and 30 characters").isLength({min: 7, max: 30})
]

export const createNoteSchema = [
    check("title", "Title required").isString().isLength({min: 1}),
    check("body", "Body required").isString().isLength({min:1}),
]