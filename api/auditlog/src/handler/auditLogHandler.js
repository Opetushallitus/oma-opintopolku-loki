const AuditLogs = require('../model/AuditLogs')
const AWS = require('aws-sdk')
const config = require('config');

const AuditLog = new AuditLogs(new AWS.DynamoDB.DocumentClient())

const hasRequiredHeaders = ({ headers }) => headers && headers.secret && headers.oid

module.exports = async (event, context) => {
  try {

    console.log(JSON.stringify({
      message: 'Received an audit log request',
      event,
      context
    }))

    if (!hasRequiredHeaders(event)) {
      return {
        statusCode: 400,
        body: 'missing headers'
      }
    }

    const { oid, secret } = event.headers

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `max-age=${config.get('cache.max-age')}`
      },
      body: JSON.stringify(await AuditLog.getAllForOid(oid))
    }

  } catch (e) {

    console.log(JSON.stringify({
      message: `Failed to serve audit log request: ${e.message}`,
      error: e,
      event,
      context
    }))

    return {
      statusCode: 500,
      body: 'internal server error'
    }
  }
}
