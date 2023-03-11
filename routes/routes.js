const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;
const Post = require('../modals/post')

const db = require("../data/database");
const session = require("express-session");
router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/admin", async function (req, res) {
  console.log(req.session.isAuthenticated);
  if (!req.session.isAuthenticated) {
    return res.status(400).render("401");
  }

  const data = await db.getDb().collection("blogs").find().toArray();
  res.render("admin", { data: data });
});

router.post("/admin", async function (req, res) {
  const name = req.body.name;
  const content = req.body.content;
  const title = req.body.title;
  const post = new Post(name,title,content);
  await post.save()
  res.redirect("/admin");
});

router.get("/posts/:id/edit",async function (req, res) {
  const id = req.params.id;
  const data = await db
    .getDb()
    .collection("blogs")
    .findOne(
      { _id: new objectId(id) })
    console.log(data)
  res.render("form", { id: id ,data:data});
});

router.post("/posts/:id/edit", async function (req, res) {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post(null,title,content,id)
  await post.update()
  res.redirect("/admin");
});

router.post("/posts/:id/delete", async function (req, res) {
  const id = req.params.id;
  const post = new Post(null,null,null,id)
  post.delete()
  res.redirect("/admin");
});

module.exports = router;
