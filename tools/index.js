const argv = require('yargs').argv
const splitArray = require('split-array');

const getCloudwatchEntries = require('./cloudwatch.js')
const getDynamoDBEntries = require('./batchquery.js')
const { toDate, endOfDay } = require('./dateutils.js')

const startDate = toDate(argv.start)
const endDate = toDate(argv.end)

if (!startDate || isNaN(startDate.getTime())) {
  console.log('Invalid --start parameter, must be e.g. 2019-01-10')
  process.exit(1)
}
if (!endDate || isNaN(endDate.getTime())) {
  console.log('Invalid --end parameter, must be e.g. 2019-01-12')
  process.exit(1)
}

const getLogEntries = async () => {

  try {

    const cloudwatchLogs = await getCloudwatchEntries(startDate, endOfDay(endDate))
    const cwLogChunks = splitArray(cloudwatchLogs, 100) // Max query batch size is 100

    cwLogChunks.forEach(async cwLogChunk => {

      const dynamoLogs = await getDynamoDBEntries(cwLogChunk)

      cwLogChunk.forEach(cwLog => { // Verify that all logs were found from DynamoDB
        if (!dynamoLogs.has(cwLog.asDynamoDBKey())) {
          console.log(`DynamoDB is missing log entry for ${cwLog.asDynamoDBKey()} : ${cwLog.targetOid}`)
        }
      })
    })

    console.log(`Processed ${cloudwatchLogs.length} log entries`)

  } catch (err) {
    console.log('Failed to process log entries', err)
  }
}

getLogEntries()

