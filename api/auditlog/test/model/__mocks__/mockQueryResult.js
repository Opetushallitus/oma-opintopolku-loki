const queryResult = [
  {
    id: '1',
    studentOid: '111',
    time: '11:11',
    organizationOid: ['666', '420'],
    raw: 'rawinput'
  },
  {
    id: '2',
    studentOid: '111',
    time: '22:22',
    organizationOid: ['322', '666'],
    raw: 'rawinput'
  },
  {
    id: '3',
    studentOid: '111',
    time: '33:33',
    organizationOid: ['322', '420'],
    raw: 'rawinput'
  },
  {
    id: '4',
    studentOid: '111',
    time: '44:44',
    organizationOid: ['999'],
    raw: 'rawinput'
  },
  {
    id: '5',
    studentOid: '111',
    time: '55:55',
    organizationOid: ['999'],
    raw: 'rawinput'
  },
]

const queryresult_2 = [
  {
    id: '1',
    studentOid: '111',
    time: '55:55',
    organizationOid: ['organisaatio1']
  },
  {
    id: '2',
    studentOid: '111',
    time: '66:66',
    organizationOid: ['organisaatio1']
  },
  {
    id: '4',
    studentOid: '111',
    time: '22:22',
    organizationOid: ['organisaatio1', 'organisaatio2'],
  },
  {
    id: '5',
    studentOid: '111',
    time: '23:23',
    organizationOid: ['organisaatio1', 'organisaatio2']
  }
]

module.exports = {
  queryResult,
  queryresult_2
}