const express = require('express')
const EventEmitter = require('events')

const broker = new EventEmitter()

express()
  .get('/auth/login', ({ query: { rd } }, res, next) => {
    res.status(200).send(`
      <html>
        <head>
          <title>Please login</title>
        </head>
        <body>
          <a href="${rd}">Complete login</a>
        </body>
      </html>
    `)
  })
  .get('/auth/cli-return/:token', ({ params: { token } }, res, next) => {
    broker.emit(token)

    res.status(200).send(`
      <html>
        <head>
          <title>Login successful</title>
        </head>
        <body>
          <h1>Login successful</h1>
          <p>You may now return to the command line.</p>
        </body>
      </html>
    `)
  })
  .get('/auth/cli-notify/:token', ({ params: { token } }, res, next) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    res.write('retry: 10000\n\n')

    const authToken = 'XYZ'

    const listener = () => res.write(`data: ${JSON.stringify({ authToken })}\n\n`)

    res.on('close', () => broker.removeListener(token, listener))

    broker.addListener(token, listener)
  })
  .listen(3000)
