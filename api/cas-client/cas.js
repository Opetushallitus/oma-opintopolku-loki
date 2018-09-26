var querystring = require('querystring');
var https = require('https');
var format = require('string-format');

format.extend(String.prototype);

const clientSubSystemCode = 'oma-opintopolku-loki-api';

function getTgt(username, password, hostname, callback) {
  var credentials = querystring.stringify({
    username: username,
    password: password
  });

  var req = https.request({
    hostname: hostname,
    port: 443,
    path: '/cas/v1/tickets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': credentials.length,
      clientSubSystemCode
    }
  }, function(res) {
    if (res.statusCode === 201)
      callback(res.headers.location);
    else {
      console.log(res)
      throw new Error('TGT:n hakeminen ei onnistunut, status code: {0}'.format(res.statusCode));
    }

  });

  req.on('error', function(e) {
    console.log('TGT virhe: ' + e.message);
    throw e;
  });

  req.write(credentials);
  req.end();
}

function getSt(hostname, tgtUrl, service, callback) {
  var serviceUrl = querystring.stringify({
    service: service
  });

  var req = https.request({
    hostname: hostname,
    port: 443,
    path: tgtUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': serviceUrl.length,
      clientSubSystemCode
    }
  }, function(res) {
    if (res.statusCode === 200)
      res.on('data', function (body) {
        callback('' + body)
      });
    else
      throw new Error('ST:n hakeminen ei onnistunut, status code: {0}'.format(res.statusCode))
  });

  req.on('error', function(e) {
    console.log('ST virhe: ' + e.message);
    throw e;
  });

  req.write(serviceUrl);
  req.end();
}

function getCookie(hostname, service, st, callback) {
  https.get('https://{0}/{1}/?ticket={2}'.format(hostname, service, st), function(res) {
    if (res.statusCode === 200) {
      var jsessionId = res.headers['set-cookie'].filter(function(header) {
        return header.match(/^JSESSIONID=.*$/)
      });
      if (jsessionId.length > 0)
        callback(jsessionId[0]);
      else
        throw new Error("JSESSIONID cookieta ei löytynyt")
    }
    else callback(null);
  }).on('error', function(e) {
    console.error(e);
    callback(null);
  });
}

module.exports = {
  withCookie: function(options, cookieCallback) {
    getTgt(options.username, options.password, options.hostname, function(tgtUrl) {
      getSt(options.hostname, tgtUrl, 'https://{0}/{1}/j_spring_cas_security_check'.format(options.hostname, options.service), function(st) {
        getCookie(options.hostname, (options.cookieUrl ? options.cookieUrl : options.service), st, function(cookie) {
          cookieCallback(cookie)
        })
      })
    })
  }
};
