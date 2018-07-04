const jwt = require('jsonwebtoken')
const db = require('./db')
const logger = require('./logger')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { JWT_SECRET } = process.env

const authorize = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent.' })
  }

  if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(403).json({ error: 'Invalid credentials.' })
  }

  const token = req.headers.authorization.split(' ')[1]

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(err.message)

      return res.status(403).json({ error: 'Invalid credentials.' })
    }

    next()
  })
}

const validate = (req, res, next) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({ error: 'Invalid Content-Type.' })
  }

  if (!req.body.original_url) {
    return res.status(400).json({ error: 'No URL provided.' })
  }

  if (db.has(req.body.shorthand)) {
    return res.status(409).json({ error: 'The provided shorthand is already taken.' })
  }

  next()
}

module.exports = { authorize, validate }
