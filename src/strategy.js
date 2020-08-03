/*
 * Module dependencies.
 */
import { InternalOAuthError, Strategy as OAuth2Strategy } from 'passport-oauth2'
import { isUndefined, defaults } from 'lodash'

const WAREHOUSE_NAME_SLUG = /^[a-z0-9-_]+$/i

/*
 * Inherit `Strategy` from `OAuth2Strategy`.
 */
class Strategy extends OAuth2Strategy {
  constructor(options = {}, verify) {
    defaults(options, {
      warehouse: 'example'
    })

    let warehouseName
    if (options.warehouse.match(WAREHOUSE_NAME_SLUG)) {
      warehouseName = `${options.warehouse}.things-factory.com`
    } else {
      warehouseName = options.warehouse
    }

    defaults(options, {
      authorizationURL: `https://${warehouseName}/admin/oauth/authorize`,
      tokenURL: `https://${warehouseName}/admin/oauth/access_token`,
      profileURL: `https://${warehouseName}/admin/warehouse.json`,
      userAgent: 'passport-things-factory',
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
        const profile = {
          provider: 'things-factory'
        }
        profile.id = json.warehouse.id
        profile.displayName = json.warehouse.warehouse_owner
        profile.username = json.warehouse.name
        profile.profileURL = json.warehouse.domain
        profile.emails = [
          {
            value: json.warehouse.email
          }
        ]
        profile._raw = body
        profile._json = json
        return done(null, profile)
      } catch (e) {
        return done(e)
      }
    })
  }

  authenticate(req, options) {
    // If warehouse is defined
    // with authentication
    if (!isUndefined(options.warehouse)) {
      const warehouseName = this.normalizewarehouseName(options.warehouse)

      // update _oauth2 settings
      this._oauth2._authorizeUrl = `https://${warehouseName}/admin/oauth/authorize`
      this._oauth2._accessTokenUrl = `https://${warehouseName}/admin/oauth/access_token`
      this._profileURL = `https://${warehouseName}/admin/warehouse.json`
    }

    // Call superclass
    return super.authenticate(req, options)
  }

  normalizewarehouseName(warehouse) {
    if (warehouse.match(WAREHOUSE_NAME_SLUG)) {
      return `${warehouse}.things-factory.com`
    }

    return warehouse
  }
}

/*
 * Expose `Strategy`.
 */
export default Strategy
