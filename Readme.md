# Passport-Things-Factory

[![NPM Version](https://img.shields.io/npm/v/passport-things-factory.svg)](https://www.npmjs.com/package/passport-things-factory)
[![Build Status](https://img.shields.io/travis/danteata/passport-things-factory/master.svg)](https://travis-ci.org/danteata/passport-things-factory)
[![Coverage Status](https://img.shields.io/codecov/c/github/danteata/passport-things-factory/master.svg)](https://codecov.io/gh/danteata/passport-things-factory/branch/master)

[Passport](http://passportjs.org/) strategy for authenticating with
[ThingsFactory](https://things-factory.com/) using the OAuth 2.0 API.

This module lets you authenticate using ThingsFactory in your Node.js applications.
By plugging into Passport, ThingsFactory authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
npm install -S passport-things-factory
```

## Usage

#### Configure Strategy

**NOTE**: Unlike other OAuth2 passport strategies, this requires a specific `warehouse` if you want it to be dynamic.

The ThingsFactory authentication strategy authenticates users using a ThingsFactory account
and OAuth 2.0 tokens. The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

**Static Warehouse Name**:

```js
passport.use(
  new ThingsFactoryStrategy(
    {
      clientID: THINGS_FACTORY_CLIENT_ID,
      clientSecret: THINGS_FACTORY_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/things-factory/callback",
      warehouse: THINGS_FACTORY_WAREHOUSE_SLUG, // e.g. my-warehouse-name.operato.com ... the `my-warehouse-name` part
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ thingsFactoryId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```

**Dynamic Warehouse Name**:

See [example](https://github.com/danteata/passport-things-factory/tree/master/example/dynamic/) folder.

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'things-factory'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get(
  "/auth/things-factory",
  passport.authenticate("things-factory", {
    scope: ["read_products"],
    warehouse: "warehouse-name",
  })
);

app.get(
  "/auth/things-factory/callback",
  passport.authenticate("things-factory", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
```

## Examples

For a complete, working example, refer to the [example](https://github.com/danteata/passport-things-factory/tree/master/example/).

## Tests

```js
npm install -d
npm run test
```

## Contributors

- [Dantheta](http://github.com/danteata)
- [Nick Baugh](https://github.com/niftylettuce)
- [Igor Goltsov](https://github.com/riversy)
- [Sebastian Iacomuzzi](https://github.com/siacomuzzi)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2016 Dantheta and Nick Baugh
