import { getTranslatedUsagePermissionDescription } from './usagePermissionDescriptions'

describe('usagePermissionDescriptions', () => {
  it('returns my data permission when isMyDataUse is true', () => {
    expect(getTranslatedUsagePermissionDescription(true)).toBeDefined()
  })

  it('returns legal permission when isMyDataUse is false', () => {
    expect(getTranslatedUsagePermissionDescription(false)).toBeDefined()
  })
})
