/*
 * Module dependencies.
 */
import { InternalOAuthError, Strategy as OAuth2Strategy } from 'passport-oauth2'
import { defaults } from 'lodash'

/*
 * Inherit `Strategy` from `OAuth2Strategy`.
 */
class Strategy extends OAuth2Strategy {
  constructor(options = {}, verify) {
    defaults(options, {
      site: 'example',
      siteBase: 'things-factory.com',
      siteProtocol: 'https'
    })

    let siteHost = `${options.siteProtocol}://${options.site}.${options.siteBase}`

    defaults(options, {
      authorizationURL: `${siteHost}/admin/oauth/authorize`,
      tokenURL: `${siteHost}/admin/oauth/access_token`,
      profileURL: `${siteHost}/admin/oauth/profile.json`,
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
    /*
     * things-factory oauth2 방식은 AuthorizationHeader 방식과 QueryString 방식을 모두 지원하므로,
     * 아래, this._oauth2.useAuthorizationHeaderforGET(true) 설정은 선택 사항이다.
     */
    this._oauth2.useAuthorizationHeaderforGET(true)
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
}

/*
 * Expose `Strategy`.
 */
export default Strategy
