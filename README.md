# Oma Opintopolku -loki

Tarjoaa näkyvyyttä siihen kuka on katsonut käyttäjän omia tietoja.

## Kansiohierarkia

- `frontend/` - Sisältää palvelun frontend-koodin.
- `parser/` - Sisältää parser-työkalun, joka parsii audit-lokieventit järjestelmistä palvelun tietokantaan.
- `tools/` - Sisältää hyödyllisiä työkaluja kehitystyöhön.

## Esivaatimukset

### Työkalut

Infrastruktuuriin hallinnoimiseen tarvitset seuraavat työkalut:

- [awscli](https://aws.amazon.com/cli/)
- [Terraform](https://www.terraform.io/)

Näiden asennuksen voit hoitaa helposti esim. MacOS:lla näin:

```shell
brew install awscli terraform
```

### AWS-kredentiaalit

#### 1. MFA:n päällekytkeminen ja API-avaimet

Pyydä infratiimiä luomaan itsellesi IAM-käyttäjätunnus. Kun saat tunnuksen:

**Kirjaudu [AWS Web-konsoliin](https://vlt-oph-federation.signin.aws.amazon.com/console):** Klikkaa omaa nimeä oikeasta yläkulmasta, sen alta "My Security Credentials" > "Users" > Etsi nimesi listasta > "Security Credentials"

**Kytke MFA päälle** ja ota "Assigned MFA device" ylös (joka on muotoa arn:aws:iam::1234567890:mfa/first.last@company.com).

**Luo itsellesi API-avain**: yllämainitulla välilehdellä "Create access key"-nappi. Ota "Access key ID" ja "Secret access key" talteen.

#### 2. API-avaimien ja tilien asennus

Jotta voit tehdä API-kutsuja AWS-tileille, pitää AWS API-avaimet ja tiliprofiilit säätää ensiksi kuntoon.

Tarkista, että vain omalla käyttäjätunnuksellasi on oikeus lukea tiedostoja `~/.aws/config` ja `~/.aws/credentials`:

    ls -l ~/.aws
    -rw-------  1 username  group  631 Aug 29 10:11 config
    -rw-------  1 username  group  123 Aug 29 10:10 credentials

##### ~/.aws/config

Tämä tiedosto sisältää kaikki awscli:n konfiguraatiot, jotka eivät ole salaisia. Varmista, että sen sisältö on vähintään tämänlainen:

```
[profile oph-federation]
region = eu-west-1
output = json

[profile oph-utility]
region = eu-west-1
output = json

[profile oph-koski-dev]
region = eu-west-1
output = json

[profile oph-koski-qa]
region = eu-west-1
output = json

[profile oph-koski-prod]
region = eu-west-1
output = json
```

##### ~/.aws/credentials

Tämä tiedosto sisältää itse API-avaimet AWS-tileille. Varmista, että sen sisältö näyttää vähintään tältä:

```shell
[oph-federation-default] <-- aws_mfa.py -skriptiä varten pysyvät kredentiaalit tallennetaan tähän "default" -profiiliin.
aws_access_key_id = <Talteen ottamasi Access Key ID>
aws_secret_access_key = <Talteen ottamasi Secret Access Key>

[oph-federation]
aws_arn_mfa = arn:aws:iam::1234567890:mfa/first.last@company.com <MFA device, jonka otit talteen>

[oph-utility]
role_arn = arn:aws:iam::190073735177:role/CustomerCloudAdmin
source_profile = oph-federation

[oph-koski-dev]
role_arn = arn:aws:iam::500150530292:role/oph-koski-cross-account-access
source_profile = oph-federation

[oph-koski-qa]
role_arn = arn:aws:iam::692437769085:role/oph-koski-cross-account-access
source_profile = oph-federation

[oph-koski-prod]
role_arn = arn:aws:iam::508832528142:role/oph-koski-cross-account-access
source_profile = oph-federation
```

#### 3. MFA-istunnon päivittäminen ja ./tools/aws_mfa.py -skripti

Tähän repositorioon on tallennettu python-skripti, jolla voit päivittää MFA-istunnon koneellesi, jotta AWS API-kutsut toimivat. Voit päivittää istunnon ajamalla:

```shell
./tools/aws_mfa.py --profile oph-federation <MFA-koodi>
```

Tämän jälkeen skripti tallentaa AWS STS-palvelusta haetut väliaikaiset kredentiaalit `~/.aws/credentials`-tiedostoon.
