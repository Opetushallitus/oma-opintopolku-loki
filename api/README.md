# Rajapinta auditlogien hakemiseen

## Jos sinulla ei ole serverless -frameworkkia, asenna se
[serverless](https://serverless.com/)

`npm i -g serverless`

## Asenna tarvittavat riippuvuudet
huom. jokaisella lambda funktiolla on omat riippuvuudet

`npm i`

To keep package-lock.json file consistent, use npm 5.x.

## Käynnistä lokaali dynamoDB
`docker run -p 8000:8000 amazon/dynamodb-local`

## Aja testit
[Jest](https://jestjs.io/)
> Muista käynnistää lokaali dynamo ennen testejä

`npm test`

## Funktion ajaminen lokaalisti:

`sls invoke local --function auditlog --data '{ "headers": {"secret":"shibbosecret", "oid": "1.2.3.4"}}'`

# Deploying

`sls create_domain` (this only needs to be run once, and most likely it has already been created)

`sls deploy --stage dev --aws-profile oph-koski-dev`

# TODO

   * Unit tests
   * Deploy to be proxied through Apache Shibbo
   * Don't log shibbo secret
