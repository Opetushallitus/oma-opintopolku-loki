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