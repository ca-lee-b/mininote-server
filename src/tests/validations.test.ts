import request from "supertest";
import { bootstrap } from "../server";
import { describe, test, } from '@jest/globals'

const app = bootstrap();

describe("test login schema", () => {
    test("POST /login with no password", (done) => {
        request(app)
            .post('/login')
            .send({
                email: "thisemaildoesnotwork@email.com",
            })
            .expect(400)
            .end((err, res ) => {
                if (err) return done(err);
                return done();
            }) 
    })
    test("POST /login with no email", (done) => {
        request(app)
            .post('/login')
            .send({
                password: "test"
            })
            .expect(400)
            .end((err, res ) => {
                if (err) return done(err);
                return done();
            }) 
    })
    test("POST /login with no body", (done) => {
        request(app)
            .post('/login')
            .expect(400)
            .end((err, res ) => {
                if (err) return done(err);
                return done();
            }) 
    })
})

describe("test register schema", () => {
    test("POST /register with no body", (done) => {
        request(app)
            .post("/register")
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with no email", (done) => {
        request(app)
            .post("/register")
            .send({
                username: "test",
                password: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with no password", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                username: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with short password", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                username: "test",
                password: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with long password", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                username: "test",
                password: "thiswordismorethanthirtycharacterslong"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with no username", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                password: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with short username", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                username: "hi",
                password: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })
    test("POST /register with long username", (done) => {
        request(app)
            .post("/register")
            .send({
                email: "test",
                username: "thisusernameistoolong",
                password: "test"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done();
            })
    })

})

/* describe("test create note schema", () => {
    test("POST /notes with no data", (done) => {
        request(app)
            .post("/notes")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done;
            })
    })
    test("POST /notes with no title", (done) => {
        request(app)
            .post("/notes")
            .send({
                body: "hello"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done;
            })
    })
    test("POST /notes with no body", (done) => {
        request(app)
            .post("/notes")
            .send({
                title: "hello"
            })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                return done;
            })
    })
}) */