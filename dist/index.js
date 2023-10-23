"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Serve static files from the 'public' directory
const publicUrl = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(publicUrl));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.set("view engine", "ejs");
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// Define a route to serve the HTML file
app.get('/', (req, res) => {
    console.log('userid: ', req.session.userId);
    res.render('index', { session: req.session });
});
app.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => console.error(err));
    res.redirect('/');
});
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.redirect('/login');
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hash = await bcrypt_1.default.hash(password, salt);
    console.log('seelct', username, hash);
    const [dbUser] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username)).limit(1);
    console.log('selected:', dbUser);
    if (dbUser) {
        const passwordMatchesHash = await bcrypt_1.default.compare(password, dbUser.hashedPassword);
        if (passwordMatchesHash) {
            req.session.userId = dbUser.id;
            res.redirect('/');
            return;
        }
        res.redirect('/login');
        return;
    }
    console.log('insert');
    // insert only returns the insertId
    const newUser = await db_1.db.insert(schema_1.users).values({
        username: username,
        hashedPassword: hash
    });
    req.session.userId = parseInt(newUser.insertId);
    res.redirect('/');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
