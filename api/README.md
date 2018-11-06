# Rajapinta auditlogien hakemiseen

## Jos sinulla ei ole serverless -frameworkkia, asenna se
[serverless](https://serverless.com/)

`npm i -g serverless`

## Asenna tarvittavat riippuvuudet
huom. jokaisella lambda funktiolla on omat riippuvuudet

`npm i`

Tiedosto `package-lock.json` on generoitu npm-versiolla 5.

## Käynnistä lokaali dynamoDB
`docker run -p 8000:8000 amazon/dynamodb-local`

## Aja testit
[Jest](https://jestjs.io/)
> Muista käynnistää lokaali dynamo ennen testejä

`npm test`

## Funktion ajaminen lokaalisti:

`sls invoke local --function auditlog --data '{ "headers": {"secret":"shibbosecret", "oid": "1.2.3.4"}}'`

# Asennus palvelinympäristöön

Ympäristöjä on kolme:

- `dev`: (TODO)
- `qa`: https://testiopintopolku.fi/oma-opintopolku-loki/
- `prod`: https://opintopolku.fi/oma-opintopolku-loki/

Domainin luonti (ajetaan vain kerran, ja on todennäköisesti ajettu jo)

`sls create_domain`

Itse asennus:

`sls deploy --stage [env] --aws-profile oph-koski-[dev]`

# TODO

   * Unit tests
   * Deploy to be proxied through Apache Shibbo
   * Don't log shibbo secret
