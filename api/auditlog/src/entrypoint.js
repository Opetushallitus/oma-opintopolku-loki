const auditLogHandler = require('./handler/auditLogHandler')

module.exports.handler = async (event, context, callback) => callback(null, await auditLogHandler(event, context))
