require('dotenv/config')
const express = require('express')
const passport = require('passport')

const auth = require('./routes/auth')
const flags = require('./routes/flags')
const experiments = require('./routes/experiments')

express()
  .use(passport.initialize())
  .use('/auth', auth)
  .use('/flags', flags)
  .use('/experiments', experiments)
  .listen(3000)
