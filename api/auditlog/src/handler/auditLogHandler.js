const AuditLogs = require('../model/AuditLogs')

const AuditLog = new AuditLogs(null)

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

    const auditLogs = await AuditLog.getAllForOid(oid)

  } catch (e) {
    return {
      statusCode: 500,
      message: 'internal server error'
    }
  }
}