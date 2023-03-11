const express = require("express");
const router = express.Router();

const authController = require('../controllers/auth-controller')


router.get("/signup", authController.getSignup);

router.get("/login",authController.getLogin);

router.post("/signup", authController.postSignup);

router.post("/login", authController.postLogin);

router.get('/401',authController.get401)

router.get("/logout",authController.logOut);

module.exports = router;
