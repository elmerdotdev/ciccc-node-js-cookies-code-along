"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLoginAuth = exports.checkAuth = void 0;
// Check authentication for My Account
const checkAuth = (req, res, next) => {
    var _a, _b;
    console.log((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated);
    if ((_b = req.session) === null || _b === void 0 ? void 0 : _b.isAuthenticated) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.checkAuth = checkAuth;
// Check authToken cookie for Login page
const checkLoginAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.isAuthenticated) {
        res.redirect('/my-account');
    }
    else {
        next();
    }
};
exports.checkLoginAuth = checkLoginAuth;
