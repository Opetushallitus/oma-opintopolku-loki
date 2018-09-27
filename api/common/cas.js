const querystring = require('querystring');
const https = require('https');
const format = require('string-format');

format.extend(String.prototype);

const clientSubSystemCode = 'oma-opintopolku-loki-api';

getTgt = (username, password, hostname, callback) => {
  const credentials = querystring.stringify({
    username: username,
    password: password
  });

  const req = https.request({
    hostname: hostname,
    port: 443,
    path: '/cas/v1/tickets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': credentials.length,
      clientSubSystemCode
    }
  }, (res) => {
    if (res.statusCode === 201)
      callback(res.headers.location);
    else
      throw new Error('TGT:n hakeminen ei onnistunut, status code: {0}'.format(res.statusCode));
  });

  req.on('error', (e) => {
    console.log('TGT virhe: ' + e.message);
    throw e;
  });

  req.write(credentials);
  req.end();
}

getSt = (hostname, tgtUrl, service, callback) => {
  const serviceUrl = querystring.stringify({
    service: service
  });

  const req = https.request({
    hostname: hostname,
    port: 443,
    path: tgtUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': serviceUrl.length,
      clientSubSystemCode
    }
  }, (res) => {
    if (res.statusCode === 200)
      res.on('data', (body) => {
        callback('' + body)
      });
    else
      throw new Error('ST:n hakeminen ei onnistunut, status code: {0}'.format(res.statusCode))
  });

  req.on('error', (e) => {
    console.log('ST virhe: ' + e.message);
    throw e;
  });

  req.write(serviceUrl);
  req.end();
}

getCookie = (hostname, service, st, callback) => {
  https.get('https://{0}/{1}/?ticket={2}'.format(hostname, service, st), (res) => {
    if (res.statusCode === 200) {
      const jsessionId = res.headers['set-cookie'].filter((header) => {
        return header.match(/^JSESSIONID=.*$/)
      });
      if (jsessionId.length > 0)
        callback(jsessionId[0]);
      else
        throw new Error("JSESSIONID cookieta ei löytynyt")
    }
    else callback(null);
  }).on('error', (e) => {
    console.error(e);
    callback(null);
  });
}

module.exports = {
  withCookie: (options, cookieCallback) => {
    getTgt(options.username, options.password, options.hostname, (tgtUrl) => {
      getSt(options.hostname, tgtUrl, 'https://{0}/{1}/j_spring_cas_security_check'.format(options.hostname, options.service), (st) => {
        getCookie(options.hostname, (options.cookieUrl ? options.cookieUrl : options.service), st, (cookie) => {
          cookieCallback(cookie)
        })
      })
    })
  }
};
