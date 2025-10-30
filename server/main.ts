import express, { Request, Response } from 'express'
import * as oauthClient from 'openid-client'
import session from 'express-session'
declare module 'express-session' {
  interface SessionData {
    pkceCodeVerifier?: any;
  }
}
import { env } from './env'

const app = express()
const port = 3000

const secretKeys = [ env.secretKey ]
const maxAge = 24 * 60 * 60 * 1000 // 24 hours

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: secretKeys,
  cookie: {
    maxAge,
  }
}))

const serverMetadata: oauthClient.ServerMetadata = {
  issuer: 'gh', // I don't know what should go here but it doesn't seem to matter
  authorization_endpoint: 'https://github.com/login/oauth/authorize',
  token_endpoint: 'https://github.com/login/oauth/access_token',
}

const config: oauthClient.Configuration = new oauthClient.Configuration(
  serverMetadata,
  env.clientId,
  env.clientSecret)

app.use(express.static('public'))

app.get('/login', async (req: Request, res: Response) => {
  req.session.pkceCodeVerifier = oauthClient.randomPKCECodeVerifier()
  const code_challenge = await oauthClient.calculatePKCECodeChallenge(req.session.pkceCodeVerifier)
  const parameters: Record<string, string> = {
    redirect_uri: env.origin + '/callback',
    scope: '',
    code_challenge,
    code_challenge_method: 'S256',
  }
  res.redirect(oauthClient.buildAuthorizationUrl(config, parameters).toString())
})

app.get('/callback', async (req, res) => {
  const currentUrl = new URL(env.origin + req.originalUrl)
  let tokens = await oauthClient.authorizationCodeGrant(config, currentUrl, {
    pkceCodeVerifier: req.session.pkceCodeVerifier,
  })
  res.send('Token Endpoint Response: ' + JSON.stringify(tokens))
  tokens.access_token
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
