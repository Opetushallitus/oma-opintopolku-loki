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
                S: 'testoid'
              },
              time: {
                S: '11:11'
              },
              'organizationOid': {
                L: [
                  { S: 'aa' }
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
                S: 'testoid'
              },
              time: {
                S: '22:22'
              },
              'organizationOid': {
                L: [
                  { S: 'aa' },
                  { S: 'bb' }
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
                S: 'testoid'
              },
              time: {
                S: '33:33'
              },
              'organizationOid': {
                L: [
                  { S: 'aa' }
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
                S: 'fakeoid'
              },
              time: {
                S: '44:44'
              },
              'organizationOid': {
                L: [
                  { S: 'cc' }
                ]
              },
              'id': {
                S: '4'
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