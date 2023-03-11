function guardRoute(req,res,next) {
    if(!res.locals.isauth) {
        return res.redirect('/401')
    }

    next()
}

module.exports = guardRoute