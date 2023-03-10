function auth (req,res,next) {
    const auth = req.session.isAuthenticated
    const user = req.session.user
    if(!auth || !user) {
      return next()
    }
    res.locals.isauth = auth
    next()
  }

module.exports = auth