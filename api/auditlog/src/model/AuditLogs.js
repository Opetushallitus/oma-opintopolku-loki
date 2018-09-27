const axios = require('axios')
const config = require('config')
const log = require('lambda-log')

class AuditLogs {
  constructor(db) {
    this.db = db

    this.http = axios.create({
      baseURL: config.get('backend.url'),
      timeout: config.get('backend.timeout')
    })
  }

  async _getOrganizationNames(oid) {
    try {
      if (oid === null || typeof oid === 'undefined' || oid === "self") return { oid, name: null }
      log.info(`Getting organization name for ${oid}`)

      const response = await this.http.get(`/organisaatio-service/rest/organisaatio/v3/${oid}`)
      const { name: nimi } = response.data
      return {
        name,
        oid
      }
    } catch (error) {
      log.error(`Failed to get organization names for ${oid}`, { error })
      throw error
    }
  }

  async _getOrganizationNameMap(oids) {
    const orgNames = await Promise.all(oids.map(async oid => await this._getOrganizationNames(oid)))

    return orgNames.reduce((obj, val) => ({ ...obj, [val.oid]: val.name }), {})
  }

  _getOrganizationOids(logsGroupedByOrgs) {
    return Object.keys(logsGroupedByOrgs)
      .map(str => str.split(','))
      .reduce((array, organizationOids) => array.concat(organizationOids), [])
      .filter((val, i, self) => self.indexOf(val) === i)
  }

  _mapNamesToOrganizationOids(logsGroupedByOrgs, nameMap) {
    return Object.keys(logsGroupedByOrgs)
      .map(str => str.split(','))
      .map(key => ({
        organizations: key.map(oid => ({ oid, name: nameMap[oid] })),
        timestamps: logsGroupedByOrgs[key]
      }))
  }

  async _mapOrganizationNames(logsGroupedByOrgs) {
    const uniqueOrgOids = this._getOrganizationOids(logsGroupedByOrgs)
    const nameMap = await this._getOrganizationNameMap(uniqueOrgOids)

    return this._mapNamesToOrganizationOids(logsGroupedByOrgs, nameMap)
  }

  _groupByOrganizationOids(auditlogs) {
    return auditlogs
      .map(({ time, organizationOid }) => ({ time, orgOids: organizationOid.sort() }))
      .reduce((obj, { time, orgOids }) => (
        obj[orgOids]
          ? { ...obj, [orgOids]: obj[orgOids].concat(time) }
          : { ...obj, [orgOids]: [time] }
      ),
        {}
      )
  }

  getAllForOid(oid) {
    const params = {
      TableName: "AuditLog",
      KeyConditionExpression: "studentOid = :oid",
      FilterExpression: "not contains (organizationOid, :self)",
      ExpressionAttributeValues: {
        ":oid": oid,
        ":self": "self"
      }
    }

    return new Promise(
      (resolve, reject) => {
        this.db.query(params, async (error, data) => {
          if (error) return reject(error)
          if (data === null || typeof data === 'undefined') return resolve([])

          const { Items } = data
          const grouped = this._groupByOrganizationOids(Items)
          const asArray = await this._mapOrganizationNames(grouped)
          resolve(asArray)
        })
      }
    )
  }
}

module.exports = AuditLogs
