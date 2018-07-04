const helmet = require('helmet')

const app = require('./src/app')
const logger = require('./src/logger')

const { PORT = 3000 } = process.env

app.listen(PORT, () => logger.info(`running at ${PORT}`))
