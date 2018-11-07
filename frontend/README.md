# Oma opintopolku -lokin käyttöliittymä

Käyttöliittymä omien tietojen käytön katseluun.

## Käytetyt teknologiat ja kehitystyökalut

- **React** (https://reactjs.org/) (sovellusrunko)
- **styled components** (https://www.styled-components.com/) (UI-tyylit)
- **NPM (5.x)** (https://www.npmjs.com/) (riippuvuuksien hallinta)
- **Jest** (https://jestjs.io/) ja **Puppeteer** (https://pptr.dev/) (testit)
- **webpack** (https://webpack.js.org/) ja **Babel** (https://babeljs.io/) (buildaus)
- **JavaScript Standard Style** (https://standardjs.com/) ja **ESLint** (https://eslint.org/) (koodityylit ja niiden tarkistus)

## Riippuvuuksien asentaminen

``` shell
npm i
```

Perusta `.env`-tiedosto kopioimalla se esimerkkitiedostosta:

```shell
cp .env-example .env
```

## Sovelluksen ajaminen paikallisesti

Käynnistä sovellus kehitysmoodissa, jolloin se käyttää `mock`-hakemistossa olevaa mock-API:a ja Webpack lataa automaattisesti sovelluksen uudelleen selaimessa, kun teet muutoksia:

```shell
npm run start:dev
```

Vaihtoehtoisesti voit tehdä dev-buildin (`npm run build:dev`) ja tarjoilla `dist`-hakemistossa olevat tiedostot jollain toisella HTTP-palvelinsovelluksella.

Saat [Oppija-raamit](https://github.com/Opetushallitus/oppija-raamit) käyttöön `proxy-oppija-raamit=true` -parametrin avulla seuraavasti:

```shell
npm run start:dev -- --proxy-oppija-raamit=true
```

## Testien ajaminen

```shell
npm test
```

## Koodityylit

Tarkista sovellus- ja testikoodien tyylit ajamalla:

```shell
npm run lint
```

JavaScript Standard Stylen lisäksi ESLint käyttää Reactin ja Jestin suositeltuja konfiguraatioita.

## Asennus palvelinympäristöön

Ympäristöjä on kolme:

- `dev`: (TODO)
- `qa`: https://testiopintopolku.fi/oma-opintopolku-loki/
- `prod`: https://opintopolku.fi/oma-opintopolku-loki/

Asennus ympäristöön `[env]` tehdään ajamalla seuraavat komennot:

```shell
export AWS_PROFILE=oph-koski-[env]
./deploy.sh [env]
```
