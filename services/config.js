module.exports = {
  oauthClientId: getEnv('OAUTH_CLIENT_ID'),
  oauthClientSecret: getEnv('OAUTH_CLIENT_SECRET'),
  redisUrl: getEnv('REDIS_URL')
}

function getEnv (key) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`missing required environment variable ${key}`)
  }

  return value
}
