class LogEntry {

  constructor(boottime, seq, hostname, targetOid) {
    this.boottime = boottime
    this.seq = seq
    this.hostname = hostname
    this.targetOid = targetOid
  }

  asDynamoDBKey() {
    return `${this.boottime};${this.seq};${this.hostname}`
  }

  asDynamoDBBatchQueryKey() {
    return {
      studentOid: {S: this.targetOid},
      id: {S: this.asDynamoDBKey()}
    }
  }
}

module.exports = LogEntry
