const AWS = require('aws-sdk');
const { addHours, addDays, toIsoDate, toIsoTime } = require('./dateutils.js')

AWS.config.update({region: 'eu-west-1'});

const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const initialParams = (start, end) => {
  console.log(`searching from dynamo until ${toIsoTime( addHours(addDays(end, 1), 2) )}`)
  return {
    TableName: "AuditLog",
    FilterExpression: "#time BETWEEN :date1 and :date2",
    ExpressionAttributeValues: {
      ":date1": {
        "S": toIsoTime(start)
      },
      ":date2": {
        "S": toIsoTime( addHours(addDays(end, 1), 2) ) // add one day so that end date is included
      },
    },
    ExpressionAttributeNames: {
      "#time": "time"
    }
  }
}

const getLogEntries = (start, end) => {

  return new Promise((resolve, reject) => {

    const logs = new Set()

    const scan = (params) => {
      ddb.scan(params, (err, data) => {
        if (err) { reject('DynamoDB query failed', err) }
        else {
          data.Items.forEach((element, index, array) => {
            logs.add(element.id.S)
          })
          if (data.LastEvaluatedKey) {
            scan({ ...params, ExclusiveStartKey: data.LastEvaluatedKey })
          } else {
            resolve(logs)
          }
        }
      })
    }

    scan(initialParams(start, end))
  })
}


module.exports = getLogEntries
