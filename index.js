require('dotenv/config')
const express = require('express')
const passport = require('passport')

const auth = require('./routes/auth')
const flags = require('./routes/flags')

express()
  .use(passport.initialize())
  .use('/auth', auth)
  .use('/flags', flags)
  .listen(3000)
