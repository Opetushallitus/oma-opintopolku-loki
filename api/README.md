# Rajapinta auditlogien hakemiseen

## Riippuvuuksien asennus

Lambda-funktioiden riippuvuuksien asennus:

``` shell
make deps
```

## Testien ajaminen

Käynnistä ja pysäytä paikallinen DynamoDB:

``` shell
make dynamodb-start
make dynamodb-stop
```

Aja testit (pystyttää myös DynamoDB:n, ellei ole jo)

``` shell
make test
```

## Funktion ajaminen lokaalisti

``` shell
./common/node_modules/.bin/sls invoke local --function auditlog --data '{ "headers": {"secret":"shibbosecret", "oid": "1.2.3.4"}}'
```

## Asennus palvelinympäristöön

Ympäristöjä on kolme:

- `dev`: (TODO)
- `qa`: https://testiopintopolku.fi/oma-opintopolku-loki/
- `prod`: https://opintopolku.fi/oma-opintopolku-loki/

Domainin luonti (ajetaan vain kerran, ja on todennäköisesti ajettu jo)

``` shell
./common/node_modules/.bin/sls create_domain
```

Itse asennus:

``` shell
make deploy env=<dev|qa|prod>
```

# TODO

   * Unit tests
   * Deploy to be proxied through Apache Shibbo
   * Don't log shibbo secret
