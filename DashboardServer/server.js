const fs = require('fs');
const path = require('path');

const JSON5 = require('json5')
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

let content = fs.readFileSync(path.join(__dirname, 'index.html')).toString();

// Live config (any cloud env) - see App.js for dev version
let config = JSON.stringify({
  ApiHost: process.env.ONGOING_API_HOST,
  DashboardHost: process.env.ONGOING_DASHBOARD_HOST,
  FirebaseClientId: process.env.ONGOING_REACT_FIREBASE_CLIENT_ID,
  FirebaseConfig: JSON5.parse(fs.readFileSync('/app/Config/Firebase/key.json').toString()),  // move string to env var
  SentryDsn: process.env.ONGOING_SENTRY_DSN.trim(),
  Release: process.env.RELEASE,
  Env: process.env.ONGOING_ENV,
});
let indexResponse = content.replace("\"__CONFIG_EMBED__\"", config);

app.get([ '*' ], function (req, res) {
  res.send(indexResponse);
});

console.log('Server starting');

app.listen(8080, '0.0.0.0');
