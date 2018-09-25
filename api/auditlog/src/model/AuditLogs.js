const axios = require('axios');
const config = require('config');

class AuditLogs {
  constructor(db) {
    this.db = db

    this.http = axios.create({
      baseURL: config.get('backend.url'),
      timeout: config.get('backend.timeout'),
    });
  }

  _toOrganizationArray(obj) {
    return Promise.all(Object.keys(obj)
      .map(async key => ({
        organizationOid: key,
        organizationNames: await this._getOrganizationNames(key),
        timestamps: obj[key]
      })))
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

  async _getOrganizationNames(oid) {
    try {
      if (oid === null || typeof oid === 'undefined' || oid === "self") return null
      console.log(JSON.stringify({message: `Getting organization name for ${oid}`}))

      const response = await this.http.get(`/organisaatio-service/rest/organisaatio/v3/${oid}`)
      return response.data.nimi
    } catch (e) {
      console.log(JSON.stringify({
        error: e,
        message: `Failed to get organization names: ${e.message}`
      }))
      return null
    }
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
        this.db.query(params, async (error, data) => {
          if (error) return reject(error)
          if (data === null || typeof data === 'undefined') return resolve([])

          const { Items } = data
          const grouped = this._groupByOrganization(Items)
          const asArray = await this._toOrganizationArray(grouped)
          resolve(asArray)
        })
      }
    )
  }
}

module.exports = AuditLogs
