import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { default as sessions } from "express-session";
import bcrypt from "bcrypt";
import { users } from "./schema";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import * as model1 from './public/model1.json'

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
const publicUrl = path.join(__dirname, 'public');
app.use(express.static(publicUrl));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: process.env.SECRET_KEY as string,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// Declare Typescript session data for code inferencing
declare module 'express-session' {
    interface SessionData {
        username: string;
        userId: number;
    }
}
app.get('/Lesson:id', function (req, res) {
    res.render('Lesson' + req.params.id);
});
app.get('/Quiz:id', function (req, res) {
    res.render('Quiz' + req.params.id);
});


// Define a route to serve the HTML file
app.get('/', (req, res) => {
    console.log('userid: ', req.session.userId)

    res.render('index', { session: req.session })
});

app.get('/login', (req, res) => {

    res.render('login', { session: req.session })
});

app.get('/Test2', (req, res) => {

    res.render('Test2', { session: req.session, model1: model1 })
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => console.error(err));
    res.redirect('/')
});




app.post('/login', async (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;

    // If the username or password field is empty, go back
    if (!username || !password) {
        res.redirect('/login');
    }

    // Basic salt and hash for security
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);

    // gets user from the db, dbUser is undefined if not in db
    const [dbUser] = await db.select().from(users).where(
        eq(users.username, username)
    ).limit(1);

    // If the user exists in the db
    if (dbUser) {
        // check if password hash matches what's in the db for the username
        const passwordMatchesHash = await bcrypt.compare(password, dbUser.hashedPassword);

        // If it matches, set the session data and redirect home
        if (passwordMatchesHash) {
            req.session.username = username
            req.session.userId = dbUser.id;
            res.redirect('/')
            return;
        }

        // Does not match, so redirect to login with error
        res.redirect('/login?error=password&email=' + username)
        return;
    }

    // insert only returns the insertId
    // User does not exist in db, so make one
    const newUser = await db.insert(users).values({
        username: username,
        hashedPassword: hash
    });

    // Set session data to new user and redirect to home
    req.session.userId = parseInt(newUser.insertId);
    req.session.username = username
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
