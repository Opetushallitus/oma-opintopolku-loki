const AuditLogs = require('../model/AuditLogs')
const AWS = require('aws-sdk')

const AuditLog = new AuditLogs(new AWS.DynamoDB.DocumentClient())
const cacheMaxAge = 600

const hasRequiredHeaders = ({ header }) => header && header.secret && header.oid

module.exports = async (event) => {
  if (!hasRequiredHeaders(event)) {
    return {
      statusCode: 400,
      message: 'missing headers'
    }
  }

  const { oid, secret } = event.header

  try {

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': `max-age=${cacheMaxAge}`
      },
      body: JSON.stringify(await AuditLog.getAllForOid(oid))
    }

  } catch (e) {

    console.log(e)

    return {
      statusCode: 500,
      message: 'internal server error'
    }
  }
}
