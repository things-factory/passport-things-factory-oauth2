/*
 * Module dependencies.
 */
import { InternalOAuthError, Strategy as OAuth2Strategy } from 'passport-oauth2'
import { defaults } from 'lodash'

const SITE_NAME_SLUG = /^[a-z0-9-_]+$/i

/*
 * Inherit `Strategy` from `OAuth2Strategy`.
 */
class Strategy extends OAuth2Strategy {
  constructor(options = {}, verify) {
    defaults(options, {
      site: 'example'
    })

    let siteName
    if (options.site.match(SITE_NAME_SLUG)) {
      siteName = `${options.site}.things-factory.com`
    } else {
      siteName = options.site
    }

    defaults(options, {
      authorizationURL: `https://${siteName}/admin/oauth2/authorize`,
      tokenURL: `https://${siteName}/admin/oauth2/access_token`,
      profileURL: `https://${siteName}/admin/oauth2/profile.json`,
      userAgent: 'passport-things-factory-oauth2',
      customHeaders: {},
      scopeSeparator: ','
    })

    defaults(options.customHeaders, {
      'User-Agent': options.userAgent
    })

    super(options, verify)
    this.name = 'things-factory'

    this._profileURL = options.profileURL
    this._clientID = options.clientID
    this._clientSecret = options.clientSecret
    this._callbackURL = options.callbackURL
  }

  userProfile(accessToken, done) {
    this._oauth2.get(this._profileURL, accessToken, (err, body) => {
      if (err) {
        return done(new InternalOAuthError('Failed to fetch user profile', err))
      }

      try {
        const json = JSON.parse(body)
        return done(null, json.profile)
      } catch (e) {
        return done(e)
      }
    })
  }

  authenticate(req, options) {
    /* CONFIRM-ME 아래 로직 확인요.
    // If site is defined
    // with authentication

    if ('site' in options) {
      const siteName = this.normalizesiteName(options.site)

      // update _oauth2 settings
      this._oauth2._authorizeUrl = `https://${siteName}/admin/oauth2/authorize`
      this._oauth2._accessTokenUrl = `https://${siteName}/admin/oauth2/access_token`
      this._profileURL = `https://${siteName}/admin/oauth2/profile.json`
    }
    */

    // Call superclass
    return super.authenticate(req, options)
  }

  normalizesiteName(site) {
    if (site.match(SITE_NAME_SLUG)) {
      return `${site}.things-factory.com`
    }

    return site
  }
}

/*
 * Expose `Strategy`.
 */
export default Strategy
