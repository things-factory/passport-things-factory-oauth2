# Example

1. Install dev dependencies:

```bash
npm install -d
cd example
```

2. Start app:

> `CLIENT_ID` is your ThingsFactory app's API key
> `CLIENT_SECRET` is your ThingsFactory app's secret key
> `EMAIL` is your ThingsFactory Dev Warehouse (or regular warehouse) email address used to log in

```bash
CLIENT_ID=20143978290-1834 CLIENT_SECRET=abcdef EMAIL=admin@hatiolab.com node app
```

3. Load <http://localhost/auth/things-factory> and follow the instructions.

4. Refer to `app.js` for more information.
