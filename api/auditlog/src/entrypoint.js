const auditLogHandler = require('./handler/auditLogHandler')

module.exports.handler = async (event, context) => await auditLogHandler(event)