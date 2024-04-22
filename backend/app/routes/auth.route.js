const { Router } = require("express");
const router = Router();

const AuthMiddleware = require("../middlewares/auth.middleware");
const AuthService = require("../services/auth.service");

const TokenMiddleware = require("../middlewares/token.middleware");
const { checkAll, checkPrivacy, checkAdmin } = new TokenMiddleware();

const authMiddleware = new AuthMiddleware();
const authService = new AuthService();

const authController = require("../controllers/auth.controller")

// SignUp
router.route("/signup").post(authMiddleware.signup,authController.signup);
// Login
router.route("/login").post( authMiddleware.login, authController.login);
//Refresh Token
router.route("/refresh").post( authMiddleware.refresh, authController.refresh)
//Update Account
router.route("/update").put(checkAdmin,authController.update);
//profile
router.route("/profile").get(authMiddleware.profile,authController.profile)
module.exports = router;