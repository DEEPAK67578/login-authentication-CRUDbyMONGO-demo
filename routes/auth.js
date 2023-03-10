const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../data/database");


router.get("/signup", function (req, res) {
  let input = req.session.inputData;
  console.log(input);
  if (!input) {
    input = {
      iserror: false,
      message: "",
      email: "",
      password: "",
      confirmEmail: "",
    };
  }
  req.session.inputData = null;
  res.render("signup", { input: input });
});

router.get("/login", function (req, res) {
  let input = req.session.inputData;
  console.log(input);
  if (!input) {
    input = {
      iserror: false,
      message: "",
      email: "",
      password: "",
    };
  }
  req.session.inputData = null;
  res.render("login", { input: input });
});

router.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmEmail = req.body.confirmEmail;
  const existingUser = await db
    .getDb()
    .collection("user")
    .findOne({ email: email });

  if (!email || !password || !confirmEmail) {
    req.session.inputData = {
      iserror: true,
      message: "Please Check your Credentials",
      email: email,
      password: password,
      confirmEmail: confirmEmail,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  if (password.length < 6) {
    req.session.inputData = {
      iserror: true,
      message: "Please Input the password length of more than 6 characters",
      email: email,
      password: password,
      confirmEmail: confirmEmail,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  if (existingUser) {
    req.session.inputData = {
      iserror: true,
      message: "User already exists",
      email: email,
      password: password,
      confirmEmail: confirmEmail,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  if (email != confirmEmail) {
    req.session.inputData = {
      iserror: true,
      message: "Confirm Email not matched",
      email: email,
      password: password,
      confirmEmail: confirmEmail,
    };
    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const data = {
    email: email,
    password: hashedPassword,
  };

  await db.getDb().collection("user").insertOne(data);
  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const userData = await db
    .getDb()
    .collection("user")
    .findOne({ email: email });

  if (!email || !password) {
    req.session.inputData = {
      iserror: true,
      message: "Please Enter your credentials",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  if (!userData) {
    req.session.inputData = {
      iserror: true,
      message: "Please Create an account to login",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordsAreEqual = await bcrypt.compare(password, userData.password);

  if (!passwordsAreEqual) {
    req.session.inputData = {
      iserror: true,
      message: "incorrect password",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  req.session.isAuthenticated = true;
  req.session.user = { id: userData._id, password: password };
  req.session.save(function () {
    res.redirect("/admin");
  });
});

router.get("/logout", function (req, res) {
  req.session.isAuthenticated = false;
  req.session.inputData = null;
  res.redirect("/");
});

module.exports = router;
