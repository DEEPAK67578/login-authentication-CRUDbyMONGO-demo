const bcrypt = require("bcrypt");
const authModal = require('../modals/auth')

function getSignup(req, res) {
  let input = req.session.inputData;
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
}

function getLogin(req, res) {
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
}

async function postSignup(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmEmail = req.body.confirmEmail;

  const existingUser1 = new authModal(email,null,null)
  const existingUser=await existingUser1.existingUser()

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
  const auth = new authModal(email,null,hashedPassword)
  await auth.signup()
  res.redirect("/login");
}

async function postLogin(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const auth = new authModal(email,null,password)
  const userData = await auth.login()

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
}

function logOut(req, res) {
  req.session.isAuthenticated = false;
  req.session.inputData = null;
  res.redirect("/");
}

function get401(req,res) {
  res.status(401).render('401')
}
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  postSignup: postSignup,
  postLogin: postLogin,
  logOut: logOut,
  get401:get401};
