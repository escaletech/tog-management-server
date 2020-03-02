require('dotenv/config')
const express = require('express')
const passport = require('passport')
const pino = require('pino')
const pinoHttp = require('express-pino-logger')

const auth = require('./routes/auth')
const flags = require('./routes/flags')

const log = pino()

express()
  .use(pinoHttp(log))
  .use(passport.initialize())
  .use('/auth', auth)
  .use('/flags', flags)
  .listen(3000, () =>
    log.child({ category: 'application', action: 'started' }).info('server started'))
