const path = require("path");
const csrf = require('csurf')
const csrfTokenMiddleware = require('./middleware/csrf-middleware')
const db = require("./data/database");
const blogRoutes = require('./routes/routes')
const authRoutes = require('./routes/auth')
const session = require('express-session')

const authMiddleware = require('./middleware/auth-middleware')

const MangoDbStore = require('connect-mongodb-session')(session)
const express = require("express");
const database = require("./data/database");
const guardRoute = require("./middleware/auth-protection-middleware");
const app = express();

app.use(express.urlencoded({extended:false}))


const store = new MangoDbStore({
  uri:'mongodb://127.0.0.1:27017',
  databaseName: 'demo',
  collection:'sessions'
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(express.static('public'))

app.use(session(
  { secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  store:store
  }
))

app.use(csrf())

app.use(authMiddleware)
app.use(csrfTokenMiddleware)

app.use(authRoutes)
app.use(blogRoutes)  



app.use(function(error,req,res,next) {
  res.render('401')
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});

