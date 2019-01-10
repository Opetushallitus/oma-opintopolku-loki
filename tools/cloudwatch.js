const AWS = require('aws-sdk');
const LogEntry = require('./logentry.js')

AWS.config.update({region: 'eu-west-1'});

const cloudwatchlogs = new AWS.CloudWatchLogs({apiVersion: '2014-03-28'});

const initialParams = (start, end) => {
  return {
    logGroupName: 'oma-opintopolku-audit-loki',
    filterPattern: '{ ($.type = "log") && ($.operation = "OPISKELUOIKEUS_KATSOMINEN") }',
    startTime: start.getTime(),
    endTime: end.getTime()
  }
}

const getLogEntries = (start, end) => {
  return new Promise((resolve, reject) => {

    const logs = []

    const filter = (params) => {
      cloudwatchlogs.filterLogEvents(params, (err, data) => {
        if (err) { reject(err) }
        else {

          data.events.forEach(log => {
            const message = JSON.parse(log.message)

            logs.push(new LogEntry(
              message.bootTime,
              message.logSeq,
              message.hostname,
              message.target.oppijaHenkiloOid
            ))
          })

          if(data.nextToken) {
            return filter({ ...params, nextToken: data.nextToken })
          } else {
            resolve(logs)
          }
        }
      })
    }

    filter(initialParams(start, end))
  })
}


module.exports = getLogEntries
