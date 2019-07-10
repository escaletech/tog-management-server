module.exports = {
  oauthClientId: getEnv('OAUTH_CLIENT_ID'),
  oauthClientSecret: getEnv('OAUTH_CLIENT_SECRET'),
  redisUrl: getEnv('REDIS_URL'),
  domainWhitelist: getList('DOMAIN_WHITELIST')
}

function getEnv (key) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`missing required environment variable ${key}`)
  }

  return value
}

function getList (key) {
  const value = process.env[key]
  return value
    ? value.split(',').map(x => x.trim())
    : []
}
