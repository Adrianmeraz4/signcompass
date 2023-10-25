import "dotenv/config";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { default as sessions } from "express-session";
import bcrypt from "bcrypt";
import { users } from "./schema";
import { and, eq } from "drizzle-orm";
import { db } from "./db";

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

declare module 'express-session' {
    interface SessionData {
        username: string;
        userId: number;
    }
}

// Define a route to serve the HTML file
app.get('/', (req, res) => {
    console.log('userid: ', req.session.userId)

    res.render('index', { session: req.session })
});

app.get('/login', (req, res) => {

    res.render('login', { session: req.session })
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => console.error(err));
    res.redirect('/')
});


app.post('/login', async (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    if (!username || !password) {
        res.redirect('/login');
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);

    console.log('seelct', username, hash);
    const [dbUser] = await db.select().from(users).where(
        eq(users.username, username)
    ).limit(1);

    console.log('selected:', dbUser)

    if (dbUser) {
        console.log('user exists')
        const passwordMatchesHash = await bcrypt.compare(password, dbUser.hashedPassword);
        if (passwordMatchesHash) {
            req.session.username = username
            req.session.userId = dbUser.id;
            res.redirect('/')
            return;
        }
        console.log('hash does not match')
        res.redirect('/login?error=password&email=' + username)
        return;
    }

    console.log('insert')
    // insert only returns the insertId
    const newUser = await db.insert(users).values({
        username: username,
        hashedPassword: hash
    });


    req.session.userId = parseInt(newUser.insertId);

    req.session.username = username

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
