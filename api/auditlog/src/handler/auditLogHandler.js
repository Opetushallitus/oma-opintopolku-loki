const AuditLogs = require('../model/AuditLogs')
const SecretManager = require('../auth/SecretManager')
const aws = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const awsSecretManager = new AWS.SecretsManager()

const auditLog = new AuditLogs(dynamodb)
const secretManager = new secretManager(awsSecretManager, null)

const hasRequiredHeaders = ({ header }) => header && header.secret && header.oid

module.exports = async (event) => {
  if (!hasRequiredHeaders(event)) {
    return {
      statusCode: 400,
      body: { message: 'missing headers' }
    }
  }

  const { oid, secret } = event.header

  try {

    const isAuthenticated = await secretManager.authenticateRequest(secret)

    if (!isAuthenticated) {
      return {
        statusCode: 401,
        body: { message: 'unauthorized request' }
      }
    }

    const auditLogs = await auditLog.getAllForOid(oid)

    return {
      statusCode: 200,
      body: { auditLogs }
    }
  } catch (e) {
    return {
      statusCode: 500,
      message: 'internal server error'
    }
  }
}