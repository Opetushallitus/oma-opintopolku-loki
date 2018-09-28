import React from 'react'
import { lensProp, map, over, view } from 'ramda'
import Query from 'http/Query'
import { lang } from 'util/preferences'
import { AlertText } from 'ui/typography'
import t from 'util/translate'
import Organization from 'component/organization/Organization'

const organizationLens = lensProp('organizations')
const nameLens = lensProp('name')
const oidLens = lensProp('oid')

const getTranslatedName = organizationName => organizationName[lang] || ''

const Log = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <AlertText>{t`Tapahtui odottamaton virhe, emmekä juuri nyt pysty näyttämään tietoja.`}</AlertText>
      if (pending) return <div>{t`Tietoja haetaan`}</div>

      const translatedOrganizations = map(over(organizationLens, map(over(nameLens, getTranslatedName))))(data)

      return translatedOrganizations.map(({ organizations, timestamps }) => {
        const key = map(view(oidLens), organizations).join(',')

        return (
          <Organization
            key={key}
            organizationAlternatives={organizations}
            timestamps={timestamps}
          />
        )
      })
    }}
  </Query>
)

export default Log
