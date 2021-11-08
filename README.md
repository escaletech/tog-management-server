# Tog Management Server

[![CircleCI](https://circleci.com/gh/escaletech/tog-management-server.svg?style=svg)](https://circleci.com/gh/escaletech/tog-management-server)

Server application that provides management of [Tog](https://github.com/escaletech/tog) flags and experiments. Best used with [Tog CLI](https://github.com/escaletech/tog-cli).

## Usage

```sh
$ docker run -d -p 3000:3000 \
  --env 'OAUTH_CLIENT_ID=XYZ' \
  --env 'OAUTH_CLIENT_SECRET=XYZ' \
  --env 'OAUTH_CALLBACK_URL=https://<DOMAIN>/auth/google/callback'
  --env 'REDIS_URL=redis://your-redis:6379' \
  escaletech/tog-management-server
```

### Configuration variables

* `OAUTH_CLIENT_ID` - Client ID for OAuth 2 authentication (**required**, see [Authentication](#authentication))
* `OAUTH_CLIENT_SECRET` - Client secret for OAuth 2 authentication (**required**, see [Authentication](#authentication))
* `OAUTH_CALLBACK_URL` - Redirect uri for OAuth 2 authentication (**required**, see [RedirectURI](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#redirecting))
* `REDIS_URL` - URL for the Redis server used by Tog (**required**, e.g. `redis://my-redis-server.com`)
* `REDIS_CLUSTER` - Set to `true` if Redis URL is a cluster (**optional**, default: `false`)
* `DOMAIN_WHITELIST` - If specified, only users from these domains will be allowed (**optional**, e.g. `escale.com.br`)

### Authentication

Currently the only supported OAuth 2 authentication provider is Google.

1. Go to [Create OAuth client ID - Google API Console](https://console.developers.google.com/apis/credentials/oauthclient)
2. When asked for **Application type**, select **Web application**
3. Add `https://<YOUR-DOMAIN>` as **Authorized JavaScript origins**
4. Add `https://<YOUR-DOMAIN>/auth/google/callback` as **Authorized redirect URIs**
5. Click **Create**
6. Use the provided **Client ID** and **Client secret** for running the server

An optional step is to define a **domain whitelist** to only allow users from a certain domain to use the API.
