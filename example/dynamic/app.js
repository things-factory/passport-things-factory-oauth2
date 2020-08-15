/* eslint strict: 0 */
'use strict'

const express = require('express')
const app = express()
const passport = require('passport')
const ThingsFactoryStrategy = require('../../lib').Strategy

if (typeof process.env.CLIENT_ID !== 'string') {
  throw new Error('you need to specify CLIENT_ID')
}

if (typeof process.env.CLIENT_SECRET !== 'string') {
  throw new Error('you need to specify CLIENT_SECRET')
}

/* eslint new-cap: 0 */
const router = express.Router()

const applications = [
  { id: 1, appKey: '42319800-24125432' },
  { id: 2, appKey: process.env.CLIENT_ID }
]

function findById(id, fn) {
  const idx = id - 1
  if (applications[idx]) {
    fn(null, applications[idx])
  } else {
    fn(new Error(`Application ${id} does not exist`))
  }
}

passport.serializeUser((user, done) => done(null, user.application.appKey))

passport.deserializeUser((id, done) => {
  findById(id, (err, user) => done(err, user))
})

app.use(passport.initialize())

router.get('/', (req, res) => {
  res.send(`visit ${req.protocol}://${req.get('host')}/auth/things-factory?site=your-site-name to begin the auth`)
})

router.get('/auth/things-factory', (req, res, next) => {
  if (typeof req.query.site !== 'string') {
    return res.send('req.query.site was not a string, e.g. /auth/things-factory?site=your-site-name')
  }

  const time = new Date().getTime()
  passport.use(
    `things-factory-${time}`,
    new ThingsFactoryStrategy(
      {
        authorizationURL: `http://system.things-factory.com:3000/admin/oauth/authorize`,
        tokenURL: `http://system.things-factory.com:3000/admin/oauth/access_token`,
        profileURL: `http://system.things-factory.com:3000/admin/oauth/profile.json`,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${req.protocol}://${req.get('host')}/auth/things-factory/${time}`,
        site: req.query.site
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('accessToken response', accessToken, refreshToken, profile)

        return done(null, {
          ...profile,
          accessToken,
          refreshToken
        })
      }
    )
  )
  return passport.authenticate(`things-factory-${time}`, {
    scope: ['read_orders'],
    site: req.query.site
  })(req, res, next)
})

router.get(
  '/auth/things-factory/:time',
  (req, res, next) => {
    if (typeof req.params.time !== 'string') {
      return res.sendStatus(500)
    }

    return passport.authenticate(`things-factory-${req.params.time}`, {
      failureRedirect: '/'
    })(req, res, next)
  },
  (req, res) => {
    // NOTE: notice how we use `passport.unuse` to delete
    // the specific strategy after it is done being used
    passport.unuse(`things-factory-${req.params.time}`)
    return res.send({ message: 'successfully logged in', user: req.user })
  }
)

app.use('/', router)

app.listen(3002, () => {
  console.log('server started at http://localhost:3002')
})
