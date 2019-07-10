const express = require('express')
const passport = require('passport')
const TogClient = require('tog')
const bodyParser = require('body-parser')
const Joi = require('@hapi/joi')

const { redisUrl } = require('../services/config')

const authenticate = passport.authenticate('bearer', { session: false })

const client = new TogClient(redisUrl)

const schema = Joi.object().keys({
  namespace: Joi.string().required(),
  name: Joi.string().required(),
  weight: Joi.number().integer().min(0).max(100).required(),
  flags: Joi.object().unknown(true)
})

module.exports = express.Router().use(authenticate)
  .get('/:namespace', (req, res, next) => {
    const { namespace } = req.params
    return client.listExperiments(namespace)
      .then(experiments => res.status(200).json(experiments))
      .catch(next)
  })

  .get('/:namespace/:name', (req, res, next) => {
    const { namespace, name } = req.params
    return client.getExperiment(namespace, name)
      .then(exp => exp
        ? res.status(200).json(exp)
        : res.status(404).json({ message: 'experiment not found' }))
      .catch(next)
  })

  .put('/:namespace/:name', bodyParser.json(), (req, res, next) => {
    const { namespace, name } = req.params
    const { weight, flags } = req.body
    const exp = { namespace, name, weight, flags }

    const val = schema.validate(exp)
    if (val.error) {
      return res.status(422).json(val.error)
    }

    return client.saveExperiment(exp)
      .then(() => res.status(200).json(exp))
      .catch(next)
  })
