const AWS = require('aws-sdk')
const LogEntry = require('./logentry.js')

AWS.config.update({region: 'eu-west-1'})

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

const params = (keys) => {
  return {
    RequestItems: {
      'AuditLog': {
        Keys: keys,
        ProjectionExpression: 'id'
      }
    }
  }
}

/**
 * Returns a list of IDs stored to DynamoDB
 * @param entries<LogEntry>[] List of LogEntries to search from DynamoDB. Can contain max 100 entries.
 * @returns {Promise<any>}
 */
const getLogEntries = (entries) => {

  return new Promise((resolve, reject) => {

    const logs = new Set()

    const getItems = (params) => {
      ddb.batchGetItem(params, (err, data) => {
        if (err) { reject('DynamoDB query failed', err) }

        else {
          data.Responses.AuditLog.forEach((element, index, array) => {
            logs.add(element.id.S)
          })

          if(data.UnprocessedKeys.size > 0) {
            getItems(data.UnprocessedKeys)
          } else {
            resolve(logs)
          }
        }
      })
    }

    const batchQueryKeys = entries.map(e => e.asDynamoDBBatchQueryKey())

    getItems(params(batchQueryKeys))
  })
}

module.exports = getLogEntries
