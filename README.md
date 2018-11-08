# Oma Opintopolku -loki

Tarjoaa näkyvyyttä siihen kuka on katsonut käyttäjän omia tietoja.

## Kansiohierarkia

- `api/` - Sisältää palvelun backend-koodin.
- `frontend/` - Sisältää palvelun frontend-koodin.
- `parser/` - Sisältää parser-työkalun, joka parsii audit-lokieventit järjestelmistä palvelun tietokantaan.
- `tools/` - Sisältää hyödyllisiä työkaluja kehitystyöhön.

## Esivaatimukset

- AWS CLI ja AWS-kredentiaalit (MFA, ~/.aws/config, ~/.aws/credentials) pitää
  olla pystytettynä; ks. ohjeet koski-aws-infra/README.md.
- Node.js (uusin 8.x sarjan + sen mukana tuleva NPM-versio)
- [Maven 3](https://maven.apache.org/) -build-työkalu
- GNU Make (OSX & Linux sisältää, komentorivillä `make`)
- Docker
 