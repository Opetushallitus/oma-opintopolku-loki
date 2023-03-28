# Oma opintopolku -lokin parseri

Lambda-funktio joka lukee audit log -tapahtumat AWS SQS -jonosta, rikastaa ne organisaatiotiedoilla ja tallentaa ne DynamoDB-tietokantaan.

## Kehitysympäristön pystyttäminen

Lambda-funktion tarvitsemat DynamoDB ja SQS ajetaan Docker-konteissa. `Makefile` sisältää komennot, joilla kontit voidaan käynnistää ja pysäyttää:

``` shell
make dynamodb-start
make sqs-start

make dynamodb-stop
make sqs-stop
```

Molemmat voidaan käynnistää ja pysäyttää myös näin:
```shell
make docker-up
make docker-down
```

Katso alempaa muutamia [hyödyllisiä komentoja Docker-konttien kanssa operoimiseen](#paikallisten-docker-konttien-kanssa-operoiminen).

## Lambdan ajaminen paikallisesti

Käynnistä ensin Docker-kontit ylläolevien ohjeiden mukaisesti.

Nyt voit ajaa lambdan serverless-työkalulla seuraavasti:

```shell
nvm use
mvn package
AWS_ACCESS_KEY_ID=123 AWS_SECRET_ACCESS_KEY=123 AWS_REGION=local npx serverless invoke local --function parser --data "{}" --stage local --config serverless.local.yml
```

### Serverless invoke local -komennon bugit

Serverlessin `invoke local` -komennossa (jolla funktioita ajetaan paikallisesti) vaikuttaa tällä hetkellä olevan joitain ongelmia.

1. Java-funktioiden tarvitsema Java bridge ei käänny automaattisesti. Siksi se pitää tehdä manuaalisesti kerran, ennen kuin funktion ajaminen toimii:

```shell
cd ../api/common/node_modules/serverless/lib/plugins/aws/invokeLocal/java
mvn package
```

2. Tämänkään jälkeen logitus Lambda-funktiossa ei toimi. Yllämainittuun Maven-projektiin joutuu lisäämään esim. `logback-json-classic` -riippuvuuden ja `logback.xml` -konfiguraation, jos haluaa logituksen käyttöön. Tämän jälkeen projekti pitää paketoida uudestaan.

## Testien ajaminen

Aja testit näin (pystyttää myös Docker-kontit, ellei niitä ole jo pystytetty).

```shell
make test
```

## Koodityylit

Tarkista tuotanto- ja testikoodien tyylit ajamalla:

```shell
make scalastyle
```

## Asennus pilviympäristöön

Funktion asennus pilviympäristöön tapahtuu komennolla `make deploy`. Se käynnistää Docker-kontit, ajaa testit ja paketoi funktion tiedostoon `target/omaopintopolkuloki-1.0-SNAPSHOT.jar`. Sen jälkeen paketoitu funktio asentuu määriteltyyn ympäristöön.

```shell
make deploy env=<dev|qa|prod>
```

## Paikallisten Docker-konttien kanssa operoiminen

### SQS

Viestin lähettäminen `default`-jonoon:

```shell
aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs send-message --queue-url http://localhost:9324/queue/default --message-body "Hello world"
```

Viestin lukeminen `default`-jonosta:

```shell
aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs receive-message --queue-url http://localhost:9324/queue/default --wait-time-seconds 10
```

SQS-konsoli selaimessa: `http://localhost:9325`

### DynamoDB

Listaa olemassaolevat taulut:

```shell
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region eu-west-1
```

Listaa kaikki lokitapahtumat:
```shell
aws dynamodb scan --table-name AuditLog --endpoint-url http://localhost:8000 --region eu-west-1
```

## TODO:

   * Check if failures are cached (Guava) or not
   * Implement an integration test for organization repository
   * `mvn deploy` task (e.g. https://github.com/SeanRoy/lambda-maven-plugin)
   * Currently no way for setting backend credentials when running locally
