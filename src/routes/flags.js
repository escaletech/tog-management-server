const express = require('express')
const passport = require('passport')
const { FlagClient, FlagNotFoundError } = require('tog-node')
const bodyParser = require('body-parser')
const Joi = require('@hapi/joi')

const { redisUrl } = require('../services/config')
const audit = require('../services/audit')

const authenticate = passport.authenticate('bearer', { session: false })

const client = new FlagClient(redisUrl)

const schema = Joi.object().keys({
  description: Joi.string(),
  rollout: Joi.array().items(
    Joi.object().keys({
      value: Joi.boolean().required(),
      percentage: Joi.number().min(0).max(99)
    })
  )
})

module.exports = express.Router().use(authenticate)
  .get('/:namespace', (req, res, next) => {
    return client.listFlags(req.params.namespace)
      .then(flags => res.status(200).json(flags))
      .catch(next)
  })

  .get('/:namespace/:name', (req, res, next) => {
    const { namespace, name } = req.params
    return client.getFlag(namespace, name)
      .then(flag => res.status(200).json(flag))
      .catch(err =>
        err.name === FlagNotFoundError.name
          ? res.status(404).json({ message: 'flag not found' })
          : next(err)
      )
  })

  .put('/:namespace/:name', bodyParser.json(), (req, res, next) => {
    const { namespace, name } = req.params

    const val = schema.validate(req.body)
    if (val.error) {
      return res.status(422).json(val.error)
    }

    const flag = {
      name,
      namespace,
      rollout: req.body.rollout,
      description: req.body.description
    }

    return client.saveFlag(flag)
      .then(() => res.status(200).json(flag))
      .then(() => audit(req, 'flags', flag))
      .catch(next)
  })

  .delete('/:namespace/:name', (req, res, next) => {
    const { namespace, name } = req.params

    return client.deleteFlag(namespace, name)
      .then(deleted => deleted
        ? res.status(204).end()
        : res.status(404).json({ message: 'flag not found' }))
  })

module.exports.quit = done => client.redis.redis.quit(done)
