const Post = require("../modals/post");


function getHome(req, res) {
  res.render("welcome");
}

async function getAdmin(req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(400).render("401");
  }

  const data = await Post.fetchAll();
  res.render("admin", { data: data });
}

async function postAdmin(req, res) {
  const name = req.body.name;
  const content = req.body.content;
  const title = req.body.title;
  const post = new Post(name, title, content);
  await post.save();
  res.redirect("/admin");
}

async function getPostEdit(req, res, next) {
  let post;
  try {
    post = new Post(null, null, null, req.params.id);
  } catch (error) {
    res.render("401");
    return;
  }

  const data = await post.fetch();
  res.render("form", { id: req.params.id, data: data });
}

async function postPostEdit(req, res) {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post(null, title, content, id);
  await post.update();
  res.redirect("/admin");
}

async function deletePost(req, res) {
  const id = req.params.id;
  const post = new Post(null, null, null, id);
  post.delete();
  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  postAdmin: postAdmin,
  getPostEdit: getPostEdit,
  postPostEdit: postPostEdit,
  deletePost: deletePost,
};
