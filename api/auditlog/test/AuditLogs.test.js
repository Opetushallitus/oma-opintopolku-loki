const AWS = require('aws-sdk')
const AuditLogs = require('../src/AuditLogs')
const { setup, teardown } = require('./__mocks__/mockDynamo')
const { queryResult } = require('./__mocks__/mockQueryResult')

AWS.config.update({
  credentials: new AWS.Credentials({
    secretAccessKey: 'localkey',
    accessKeyId: 'localid'
  }),
  endpoint: 'http://localhost:8000',
  region: 'localregion'
})

const dynamodb = new AWS.DynamoDB() //for writing mocks
const client = new AWS.DynamoDB.DocumentClient() //actual db client
const AuditLog = new AuditLogs(client)

beforeAll(() => {
  return setup(dynamodb)
})

afterAll(() => {
  return teardown(dynamodb)
})

test('should group organizations by their oid', () => {
  const grouped = AuditLog._groupByOrganization(queryResult)
  expect(grouped).toEqual(
    {
      '666': [
        '11:11',
        '22:22'
      ],
      '322': [
        '22:22',
        '33:33'
      ],
      '420': [
        '11:11',
        '33:33'
      ],
      '999': [
        '44:44',
        '55:55'
      ]
    }
  )
})

test('should return auditlogs for given oid', async () => {
  const logsForOid = await AuditLog.getAllForOid('testoid')
  expect(logsForOid)
    .toEqual(
      {
        'aa': [
          '11:11',
          '22:22',
          '33:33'
        ],
        'bb': [
          '22:22'
        ]
      }
    )
})
