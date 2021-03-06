import fs from 'fs'
import http from 'http'
import path from 'path'
import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import basicAuth from 'basic-auth'
import { template } from 'lodash'
import { initIo } from './socketio'
import error from './error'
import { getAppConfig } from './appConfig'
import apiRouter from './apiRouter'
import cacheControl from './cacheControl'
import './db'
import './particleEventListener'

const app = express()
const server = http.Server(app)
initIo(server)
app.use(bodyParser.json())
app.use(compression())

// dev stuff
/* eslint-disable import/no-extraneous-dependencies */
if (process.env.NODE_ENV === 'development') {
  // log request stats
  app.use(require('morgan')('dev')) // eslint-disable-line global-require

  // delay response
  if (getAppConfig('responseDelay')) {
    app.use(/^\/api/, (req, res, next) => {
      setTimeout(next, getAppConfig('responseDelay'))
    })
  }

  // redirect bundle to webpack (hot reload)
  const httpProxy = require('http-proxy') // eslint-disable-line global-require

  app.get(/^\/bundle/, (req, res, next) => {
    httpProxy.createProxyServer().web(req, res,
      { target: `http://localhost:${process.env.npm_package_config_webpackPort}` },
      next
    )
  })
}
/* eslint-enable import/no-extraneous-dependencies */
else {
  // redirect http -> https (
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'http') {
      res.redirect(`https://${req.host}${req.url}`)
    }
    else {
      next()
    }
  })

  app.get('/bundle/*', express.static(path.join(__dirname, './public')))
}

// basic auth
if (getAppConfig('authEnabled')) {
  app.use((req, res, next) => {
    res.set('WWW-Authenticate', `Basic realm="${getAppConfig('name')}"`)
    const user = basicAuth(req)
    if (!user || user.name !== getAppConfig('authUser') || user.pass !== getAppConfig('authPass')) {
      next(error(401, 'unauthorized'))
    }
    else {
      next()
    }
  })
}

app.use(apiRouter())

// default to index.html
const index = template(fs.readFileSync(path.resolve(__dirname, 'index.html')))
app.use(cacheControl(false), (req, res) => {
  res.set('content-type', 'text/html')
  res.send(index({
    name: getAppConfig('name')
  }))
})

// error handling
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack ? err.stack : err) // eslint-disable-line no-console
  const message = !err.message && err.status === 404 ? 'not found' : err.message
  const status = err.status || 500

  res.status(status)
  if (err.json) {
    res.json(err.json)
  }
  else {
    res.send(`${status} - ${message}`)
  }
})

export default server
