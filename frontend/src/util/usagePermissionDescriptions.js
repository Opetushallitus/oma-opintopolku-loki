import t from 'util/translate'

import permissionsMap from 'Resources/mapping/usagePermissionDescriptions'

export const getTranslatedUsagePermissionDescription = organizationOid => {
  const permission = permissionsMap[organizationOid] || permissionsMap.default
  return t(permission)
}

export const isMydataPartner = organizationOid => {
  return Boolean(permissionsMap[organizationOid])
}
