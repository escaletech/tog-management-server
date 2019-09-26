const express = require('express')
const passport = require('passport')
const TogClient = require('tog-node')
const R = require('ramda')
const bodyParser = require('body-parser')

const { redisUrl } = require('../services/config')
const audit = require('../services/audit')

const authenticate = passport.authenticate('bearer', { session: false })

const client = new TogClient(redisUrl)

module.exports = express.Router().use(authenticate)
  .get('/:namespace', (req, res, next) => {
    return client.listFlags(req.params.namespace)
      .then(flags => R.toPairs(flags).map(([ name, state ]) => ({ name, state })))
      .then(flags => res.status(200).json(flags))
      .catch(next)
  })

  .get('/:namespace/:name', (req, res, next) => {
    const { namespace, name } = req.params
    return client.listFlags(namespace)
      .then(flags => flags[name])
      .then(flag => flag !== undefined
        ? res.status(200).json({ namespace, name, state: flag })
        : res.status(404).json({ message: 'flag not found' }))
      .catch(next)
  })

  .put('/:namespace/:name', bodyParser.json(), (req, res, next) => {
    const { namespace, name } = req.params
    const { state, description } = req.body
    return client.setFlag(namespace, name, state, description)
      .then(() => res.status(200).json({ namespace, name, state, description }))
      .then(() => audit(req, 'flags', { namespace, name, state, description }))
      .catch(next)
  })
