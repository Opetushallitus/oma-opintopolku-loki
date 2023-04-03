import React from 'react'
import { lensProp, map, over } from 'ramda'
import styled from 'styled-components'
import Query from 'http/Query'
import { lang } from 'util/preferences'
import { AlertText } from 'ui/typography'
import constants from 'ui/constants'
import t from 'util/translate'
import Organizations from 'component/organization/Organizations'
import Footnote from 'component/generic/widget/Footnote'
import PropTypes from 'prop-types'
import ExternalLink from './generic/widget/ExternalLink'

const organizationLens = lensProp('organizations')
const nameLens = lensProp('name')

const NotificationText = styled.div`
  margin: 4.429rem 0;
  font-size: ${constants.font.size.xl};
  letter-spacing: 0.0214rem;
`

const getTranslatedName = organizationName => organizationName[lang] || organizationName.fi || ''

const NoEntries = () => (
  <div>
    <NotificationText>
      <p>{t`Tällä sivulla näytetään toimijat, jotka ovat käyttäneet opinto- ja varhaiskasvatustietojasi.`}</p>
      <p>{`${t('Sivu on tyhjä, koska tietojasi ei ole vielä käytetty')}**`}</p>
    </NotificationText>
    <Footnotes noEntries={true} />
  </div>
)

const Footnotes = ({ noEntries }) => (
  <React.Fragment>
    <Footnote>
      {t('Koskee vain opintotietoja --prefix')}
      <ExternalLink
        text={t('Koskee vain opintotietoja --link-title')}
        url={t('tietosuojaseloste-link')}
        openInNewTab={true}
      />{t('Koskee vain opintotietoja --suffix')}
    </Footnote>
    <Footnote stars={2}>
      {noEntries
        ? t('Tietojen käyttäjät näytetään eri tietorekistereistä seuraavasti --ei-katsomisia')
        : t('Tietojen käyttäjät näytetään eri tietorekistereistä seuraavasti')}
      <br />
      {t('Opintosuoritukset (KOSKI)')} - {t('14.11.2018 alkaen')}
      <br />
      {t('Varhaiskasvatuksen tietovaranto (Varda)')} - {t('7.4.2023 alkaen')}
    </Footnote>
  </React.Fragment>
)
Footnotes.propTypes = {
  noEntries: PropTypes.bool.isRequired
}

function Log ({ hetu }) {
  return (
    <Query url={'/koski/api/omaopintopolkuloki/auditlogs'} method={'post'} body={{ hetu }}>
      {({ data, error, pending }) => {
        if (error) return <AlertText>{t`Tapahtui odottamaton virhe, emmekä juuri nyt pysty näyttämään tietoja.`}</AlertText>
        if (pending) return <div>{t`Tietoja haetaan`}</div>
        if (!Array.isArray(data) || !data.length) return <NoEntries/>

        const translatedOrganizations = map(over(organizationLens, map(over(nameLens, getTranslatedName))))(data)
        return (<React.Fragment>
          <Organizations translatedOrganizations={translatedOrganizations}/>
          <Footnotes noEntries={false}/>
        </React.Fragment>)
      }}
    </Query>
  )
}
Log.propTypes = {
  hetu: PropTypes.string
}

export default Log
