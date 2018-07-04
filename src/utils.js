const randomstring = require('randomstring')

const randomUrl = () => randomstring.generate({ length: 7, readable: true })

module.exports = { randomUrl }
