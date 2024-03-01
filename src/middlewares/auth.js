const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1]

    try {

        const verified = jwt.verify(token, 'angeltg123')
        console.log(verified)
        req.verifiedUser = verified.user
        next()
    }catch {
        next();
    }

}

module.exports = {
    authenticate,
}