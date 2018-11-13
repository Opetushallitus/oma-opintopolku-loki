const AWS = require('aws-sdk')
const AuditLogs = require('../../src/model/AuditLogs')
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

const dynamodb = new AWS.DynamoDB() //for initing mock data to db

beforeAll(() => {
  return setup(dynamodb)
})

afterAll(() => {
  return teardown(dynamodb)
})

describe('with mocked organisaatio-service requests', () => {

  let AuditLog

  beforeAll(() => {
    AuditLog = new AuditLogs(new AWS.DynamoDB.DocumentClient())

    //mock auditlog http request
    AuditLog._getOrganizationNames = (oid) => {
      if (oid === null || typeof oid === 'undefined' || oid === "self") return { oid, name: null }
      if (oid === 'ERROR') throw new Error('test_error')
      return { oid, name: { fi: '' } }
    }
  })


  test('should group organizations by their organizationOid array', () => {
    const grouped = AuditLog._groupByOrganizationOids(queryResult)
    expect(grouped).toEqual(
      {
        [[
          'organisaatio1',
          'organisaatio2'
        ]]: [
            '22:22',
            '23:23'
          ]
        ,
        [[
          'organisaatio1'
        ]]: [
            '55:55',
            '66:66'
          ]
      }
    )
  })

  test('no auditlogs', async () => {
    const auditLogsForOid = await AuditLog.getAllForOid('no_audit_logs')
    expect(auditLogsForOid).toEqual([])
  })

  test('should filter logs where organizationOid is self', async () => {
    const auditLogsForOid = await AuditLog.getAllForOid('student2')
    expect(auditLogsForOid).toEqual([
      {
        organizations: [
          {
            oid: 'organisaatio1',
            name: { fi: '' }
          }
        ],
        timestamps: [
          '66:66'
        ]
      }
    ])
  })

  test('returns auditlogs for oid', async () => {
    const auditLogsForOid = await AuditLog.getAllForOid('student1')
    expect(auditLogsForOid).toEqual(
      [
        {
          organizations: [
            {
              oid: 'organisaatio1',
              name: { fi: '' }
            }
          ],
          timestamps: [
            '11:11'
          ]
        },
        {
          organizations: [
            {
              oid: 'organisaatio1',
              name: { fi: '' }
            },
            {
              oid: 'organisaatio2',
              name: { fi: '' }
            }
          ],
          timestamps: [
            '22:22',
            '55:55'
          ]
        },
        {
          organizations: [
            {
              oid: 'organisaatio3',
              name: { fi: '' }
            }
          ],
          timestamps: [
            '33:33',
            '44:44'
          ]
        }
      ]
    )
  })

  test('returns auditlogs only for OPISKELUOIKEUS_KATSOMINEN events', async () => {
    const auditLogsForOid = await AuditLog.getAllForOid('student3')
    expect(auditLogsForOid).toEqual(
      [
        {
          organizations: [
            {
              oid: 'organisaatio1',
              name: { fi: '' }
            }
          ],
          timestamps: [
            '100:100'
          ]
        }
      ]
    )
  })

  test('if organisaatio-service request fails', async () => {
    try {
      await AuditLog.getAllForOid('error_student')
    } catch (e) {
      expect(e).toBeDefined()
    }
  })
})
