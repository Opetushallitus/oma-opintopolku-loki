# Oma Opintopolku -loki

Tarjoaa näkyvyyttä siihen kuka on katsonut käyttäjän omia tietoja.

[![Build Status](https://travis-ci.org/Opetushallitus/oma-opintopolku-loki.svg?branch=master)](https://travis-ci.org/Opetushallitus/oma-opintopolku-loki)

![Arkkitehtuuri](/docs/architecture.png)

## Kansiohierarkia

- `frontend/` - Sisältää palvelun frontend-koodin.
- `parser/` - Sisältää parser-työkalun, joka parsii audit-lokieventit järjestelmistä palvelun tietokantaan.

## Esivaatimukset

- AWS CLI ja AWS-kredentiaalit (MFA, ~/.aws/config, ~/.aws/credentials) pitää
  olla pystytettynä; ks. ohjeet koski-aws-infra/README.md.
- Node.js (uusin 12.x sarjan + sen mukana tuleva NPM-versio)
- [Maven 3](https://maven.apache.org/) -build-työkalu
- GNU Make (OSX & Linux sisältää, komentorivillä `make`)
- Docker
