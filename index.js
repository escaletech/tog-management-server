require('dotenv/config')
const express = require('express')
const passport = require('passport')

const auth = require('./routes/auth')

express()
  .use(passport.initialize())
  .use('/auth', auth)
  .listen(3000)
