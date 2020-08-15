import { Strategy as ThingsFactoryStrategy } from '../src'
import nock from 'nock'
import { InternalOAuthError } from 'passport-oauth2'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
const expect = chai.expect
chai.use(dirtyChai)

describe('ThingsFactoryStrategy', () => {
  describe('strategy', () => {
    let strategy
    beforeEach(() => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret'
        },
        () => {}
      )
    })

    it('should be named things-factory', () => {
      expect(strategy.name).to.equal('things-factory')
    })

    it('should have default user agent', () => {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('passport-things-factory-oauth2')
    })
  })

  describe('strategy with user agent option', () => {
    let strategy
    beforeEach(() => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret',
          userAgent: 'example.com'
        },
        () => {}
      )
    })

    it('should have correct user agent', () => {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('example.com')
    })
  })

  describe('strategy with user agent option in custom headers', () => {
    let strategy
    beforeEach(() => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret',
          customHeaders: {
            'User-Agent': 'example2.com'
          }
        },
        () => {}
      )
    })

    it('should have correct user agent', () => {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('example2.com')
    })
  })

  describe('strategy with user agent option in custom headers and explicit option', () => {
    let strategy
    beforeEach(() => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret',
          customHeaders: {
            'User-Agent': 'example2.com'
          },
          userAgent: 'example3.com'
        },
        () => {}
      )
    })

    it('should prefer custom headers', () => {
      expect(strategy._oauth2._customHeaders['User-Agent']).to.equal('example2.com')
    })
  })

  describe('strategy when loading user profile', () => {
    let strategy
    beforeEach(done => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret'
        },
        () => {}
      )

      const body = `{ 
        "profile": {
          "name": "Operato MMS",
          "description": null,
          "email": "20143978290-1834@system",
          "type": "application",
          "domain": {
            "name": "SYSTEM",
            "subdomain": "system",
            "brandName": null,
            "brandImage": null,
            "contentImage": null,
            "timezone": null
          },
          "application": { "appKey": "20143978290-1834" }
        }
      }`
      nock('https://example.things-factory.com')
        .get('/admin/oauth/profile.json')
        .query({
          access_token: 'access-token'
        })
        .reply(200, body)

      done()
    })

    afterEach(() => nock.cleanAll())

    describe('when told to load user profile', () => {
      it('should not throw an error', done => {
        strategy.userProfile('access-token', done)
      })

      it('should load profile', done => {
        strategy.userProfile('access-token', (err, profile) => {
          if (err) {
            return done(err)
          }

          expect(profile.name).to.equal('Operato MMS')
          expect(profile.type).to.equal('application')
          return done()
        })
      })
    })
  })

  describe('strategy when loading user profile from custom URL', () => {
    let strategy
    beforeEach(done => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret',
          profileURL: 'https://things-factory.corpDomain/api/v3/user'
        },
        () => {}
      )

      const body = `{
        "profile": {
          "name": "Operato MMS",
          "description": null,
          "email": "20143978290-1834@system",
          "type": "application",
          "domain": {
            "name": "SYSTEM",
            "subdomain": "system",
            "brandName": null,
            "brandImage": null,
            "contentImage": null,
            "timezone": null
          },
          "application": { "appKey": "20143978290-1834" }
        }
      }`

      nock('https://things-factory.corpDomain/api/v3')
        .get('/user')
        .query({
          access_token: 'access-token'
        })
        .reply(200, body)

      done()
    })

    afterEach(() => nock.cleanAll())

    describe('when told to load user profile', () => {
      it('should not throw an error', done => {
        strategy.userProfile('access-token', done)
      })

      it('should load profile', done => {
        strategy.userProfile('access-token', (err, profile) => {
          if (err) {
            return done(err)
          }

          expect(profile.name).to.equal('Operato MMS')
          expect(profile.type).to.equal('application')
          return done()
        })
      })
    })
  })

  describe('strategy when loading user profile and encountering an error', () => {
    let strategy
    beforeEach(done => {
      strategy = new ThingsFactoryStrategy(
        {
          clientID: 'ABC123',
          clientSecret: 'secret'
        },
        () => {}
      )

      nock('https://example.things-factory.com')
        .get('/admin/oauth/profile.json')
        .query({
          access_token: 'access-token'
        })
        .replyWithError(new Error('something-went-wrong'))

      done()
    })

    afterEach(() => nock.cleanAll())

    describe('when told to load user profile', () => {
      it('should error', done => {
        strategy.userProfile('access-token', err => {
          expect(err).to.be.an.instanceof(Error)
          return done()
        })
      })

      it('should wrap error in InternalOAuthError', done => {
        strategy.userProfile('access-token', err => {
          expect(err).to.be.an.instanceof(InternalOAuthError)
          return done()
        })
      })

      it('should not load profile', done => {
        strategy.userProfile('access-token', (err, profile) => {
          expect(profile).to.be.an('undefined')
          return done()
        })
      })
    })
  })
})
