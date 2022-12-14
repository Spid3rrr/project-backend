const jwt = require('jsonwebtoken');

function generateToken(username) {
    return jwt.sign(username, process.env.JWT_SECRET);
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.status(401).json({message:"unauthorized"})
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
}

module.exports = {generateToken,verifyToken};