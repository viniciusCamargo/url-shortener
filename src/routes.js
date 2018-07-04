const express = require('express')
const db = require('./db')
const { authorize, validate } = require('./middleware')
const { randomUrl } = require('./utils')

const router = express.Router()

router.post('/api/create', [authorize, validate], (req, res) => {
  const originalUrl = req.body.original_url

  let shorthand

  if (req.body.shorthand) {
    shorthand = req.body.shorthand

    db.set(req.body.shorthand, originalUrl)
  } else {
    shorthand = randomUrl()

    db.set(shorthand, originalUrl)
  }

  res.status(201).json({ shorthand })
})

router.get('/:shorthand', (req, res) => {
  const shorthand = db.get(req.params.shorthand)

  if (!shorthand) {
    return res.status(404).json({ error: 'The provided shorthand was not found.' })
  }

  res.redirect(shorthand)
})

module.exports = router
