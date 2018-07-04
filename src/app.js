const express = require('express')
const helmet = require('helmet')

const app = express()

const routes = require('./routes')
const logger = require('./logger')

if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'))
}

app.use(helmet())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(routes)

module.exports = app
