"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const pageRouter = (0, express_1.Router)();
const hashPassword = (password, saltRounds) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(saltRounds);
    const hash = yield bcrypt_1.default.hash(password, salt);
    return hash;
});
// In-memory database
let users = [];
// Home route
pageRouter.get('/', (req, res) => {
    res.status(200).render('index');
});
// Login route
pageRouter.get('/login', auth_1.checkLoginAuth, (req, res) => {
    res.status(200).render('login');
});
// Process login route
pageRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const found = users.find(user => user.username === username);
    if (found && (yield bcrypt_1.default.compare(password, found.password))) {
        // res.cookie('authToken', 'authenticated', {
        //   maxAge: 3 * 60 * 1000, // 3 minutes
        //   httpOnly: true,
        //   signed: true
        // })
        req.session.isAuthenticated = true;
        res.cookie('user_info', JSON.stringify({
            username: found.username,
            email: found.email
        }), {
            maxAge: 3 * 60 * 1000,
            httpOnly: true
        });
        res.redirect('/my-account');
    }
    else {
        res.redirect('/login');
    }
}));
// Register route
pageRouter.get('/register', (req, res) => {
    res.status(200).render('register');
});
// Register process route
pageRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const saltRounds = 12;
        const hashed = yield hashPassword(password, saltRounds);
        users.push({ username, password: hashed, email });
        console.log(users);
        res.status(201).send(`User added with password: ${hashed}`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}));
// My Account route
pageRouter.get('/my-account', auth_1.checkAuth, (req, res) => {
    const { username, email } = JSON.parse(req.cookies.user_info); // Convert string to object
    res.status(200).render('my_account', { username, email });
});
// Logout Route
pageRouter.get('/logout', (req, res) => {
    req.session = null;
    res.clearCookie('user_info');
    res.redirect('/');
});
exports.default = pageRouter;
