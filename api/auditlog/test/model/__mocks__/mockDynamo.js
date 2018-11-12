const createLogTable = (db) => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'studentOid',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'studentOid',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'id',
        KeyType: 'RANGE'
      }
    ],
    TableName: 'AuditLog',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }

  return new Promise(
    (resolve, reject) => {
      db.createTable(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    }
  )
}

const deleteLogTable = (db) => {
  const params = {
    TableName: 'AuditLog'
  }

  return new Promise(
    (resolve, reject) => {
      db.deleteTable(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    }
  )
}

const insertMockData = (db) => {
  params = {
    RequestItems: {
      'AuditLog': [
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '11:11'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '1'
              },
              'raw': {
                S: '{"version":1,"logSeq":1,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"11:11","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '22:22'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' },
                  { S: 'organisaatio2' }
                ]
              },
              'id': {
                S: '2'
              },
              'raw': {
                S: '{"version":1,"logSeq":2,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"22:22","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233345","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '33:33'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio3' }
                ]
              },
              'id': {
                S: '3'
              },
              'raw': {
                S: '{"version":1,"logSeq":3,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"33:33","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233346","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '44:44'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio3' }
                ]
              },
              'id': {
                S: '4'
              },
              'raw': {
                S: '{"version":1,"logSeq":4,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"44:44","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233346","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          },
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '55:55'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio2' },
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '5'
              },
              'raw': {
                S: '{"version":1,"logSeq":5,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"55:55","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233345","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          },
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student2'
              },
              time: {
                S: '66:66'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '6'
              },
              'raw': {
                S: '{"version":1,"logSeq":6,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"66:66","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student2"},"changes":{}}'
              }
            }
          },
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student2'
              },
              time: {
                S: '77:77'
              },
              'organizationOid': {
                L: [
                  { S: 'self' }
                ]
              },
              'id': {
                S: '7'
              },
              'raw': {
                S: '{"version":1,"logSeq":7,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"77:77","serviceName":"koski","applicationType":"backend","user":{"oid":"student2","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student2"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'error_student'
              },
              time: {
                S: '88:88'
              },
              'organizationOid': {
                L: [
                  { S: 'ERROR' }
                ]
              },
              'id': {
                S: '8'
              },
              'raw': {
                S: '{"version":1,"logSeq":8,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"88:88","serviceName":"koski","applicationType":"backend","user":{"oid":undefined,"ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"error_student"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student1'
              },
              time: {
                S: '99:99'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '9'
              },
              'raw': {
                S: '{"version":1,"logSeq":9,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"99:99","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_MUUTOS","target":{"oppijaHenkiloOid":"student1"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student3'
              },
              time: {
                S: '100:100'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '10'
              },
              'raw': {
                S: '{"version":1,"logSeq":10,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"100:100","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student3"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student3'
              },
              time: {
                S: '101:101'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '11'
              },
              'raw': {
                S: '{"version":1,"logSeq":11,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"101:101","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"KANSALAINEN_OPISKELUOIKEUS_KATSOMINEN","target":{"oppijaHenkiloOid":"student3"},"changes":{}}'
              }
            }
          }
        },
        {
          PutRequest: {
            Item: {
              'studentOid': {
                S: 'student3'
              },
              time: {
                S: '102:102'
              },
              'organizationOid': {
                L: [
                  { S: 'organisaatio1' }
                ]
              },
              'id': {
                S: '12'
              },
              'raw': {
                S: '{"version":1,"logSeq":12,"type":"log","bootTime":"2018-08-24T13:18:32.667+03","hostname":"","timestamp":"102:102","serviceName":"koski","applicationType":"backend","user":{"oid":"1.2.345.678.90.11122233344","ip":"10.0.0.1","session":"","userAgent":"Apache-HttpClient/4.3.6 (java 1.5)"},"operation":"OPISKELUOIKEUS_MUUTOS","target":{"oppijaHenkiloOid":"student3"},"changes":{}}'
              }
            }
          }
        }
      ]
    }
  }

  return new Promise(
    (resolve, reject) => {
      db.batchWriteItem(params, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    }
  )
}

const setup = async (db) => {
  await createLogTable(db)
  await insertMockData(db)
}

const teardown = async (db) => {
  await deleteLogTable(db)
}

module.exports = {
  setup,
  teardown
}
