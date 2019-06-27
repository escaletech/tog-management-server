const express = require('express')
const passport = require('passport')
const TogClient = require('tog')
const R = require('ramda')

const { redisUrl } = require('../services/config')

const authenticate = passport.authenticate('bearer', { session: false })

const client = new TogClient(redisUrl)

module.exports = express.Router()
  .get('/:namespace', authenticate, (req, res, next) => {
    return client.listFlags(req.params.namespace)
      .then(flags => R.toPairs(flags).map(([ name, state ]) => ({ name, state })))
      .then(flags => res.status(200).json(flags))
      .catch(next)
  })

  .get('/:namespace/:name', authenticate, (req, res, next) => {
    const { namespace, name } = req.params
    return client.listFlags(namespace)
      .then(flags => flags[name])
      .then(flag => flag !== undefined
        ? res.status(200).json({ namespace, name, state: flag })
        : res.status(404).json({ message: 'flag not found' }))
      .catch(next)
  })
