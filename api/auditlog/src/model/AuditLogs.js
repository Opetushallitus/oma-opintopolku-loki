class AuditLogs {
  constructor(db) {
    this.db = db
  }

  _objectToArray(obj) {
    return Object.keys(obj)
      .map(key => ({
        organizationOid: key,
        timestamps: obj[key]
      }))
  }

  _groupByOrganization(array) {
    return array
      .map(({ time, organizationOid }) => organizationOid.map(orgOid => ({ time, orgOid })))
      .reduce((array, val) => array.concat(val), [])
      .reduce((obj, { time, orgOid }) => (
        obj[orgOid]
          ? { ...obj, [orgOid]: obj[orgOid].concat(time) }
          : { ...obj, [orgOid]: [time] }
      ),
        {}
      )
  }

  getAllForOid(oid) {
    const params = {
      TableName: "AuditLog",
      KeyConditionExpression: "studentOid = :sOid",
      ExpressionAttributeValues: {
        ":sOid": oid
      }
    }

    return new Promise(
      (resolve, reject) => {
        this.db.query(params, (error, data) => {
          if (error) reject(error)

          const { Items } = data
          const grouped = this._groupByOrganization(Items)
          const asArray = this._objectToArray(grouped)
          resolve(asArray)
        })
      }
    )
  }
}

module.exports = AuditLogs