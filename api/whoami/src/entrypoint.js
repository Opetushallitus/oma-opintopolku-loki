const whoamiHandler = require('./handler/whoamiHandler')

module.exports.handler = async (event, context, callback) => callback(null, await whoamiHandler(event, context))
