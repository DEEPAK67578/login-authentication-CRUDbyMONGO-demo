const express = require("express");
const router = express.Router();
const blogControllers = require('../controllers/post-controllers')

const guardRoute = require('../middleware/auth-protection-middleware')

router.get("/",blogControllers.getHome);

router.use(guardRoute)

router.get("/admin", blogControllers.getAdmin);

router.post("/admin", blogControllers.postAdmin);

router.get("/posts/:id/edit",blogControllers.getPostEdit);

router.post("/posts/:id/edit", blogControllers.postPostEdit);

router.post("/posts/:id/delete",blogControllers.deletePost);

module.exports = router;
