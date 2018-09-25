# Rajapinta auditlogien hakemiseen

## Jos sinulla ei ole serverless -frameworkkia, asenna se
`npm i -g serverless`

## Asenna tarvittavat riippuvuudet
### huom. jokaisella lambda funktiolla on omat riippuvuudet
`npm i`

## Käynnistä lokaali dynamoDB
`docker run -p 8000:8000 amazon/dynamodb-local`

## Juokse testit
> Muista käynnistää lokaali dynamo ennen testejä
`npm test`

## Funktion ajaminen lokaalisti:

sls invoke local --function auditlog --data '{ "headers": {"secret":"shibbosecret", "oid": "1.2.3.4"}}'
