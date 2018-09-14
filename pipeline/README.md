# Audit-lokiputki

Audit-lokiputki sisältää seuraavat komponentit:

- CloudWatch-lokiagentti pyörii palveluiden palvelimilla (Asennus tapahtuu palveluiden infrakonfiguraatiossa)
- CloudWatch-lokiagentti puskee audit-lokia samaan CloudWatch Log Groupiin
- CloudWatch Log Groupiin on kytketty Subscription Filter, joka triggeröi cloudwatch-to-sqs -funktion AWS Lambdassa
- cloudwatch-to-sqs -funktio puskee lokieventit SQS-jonoon

## Setup

### 1. Luo cloudwatch-to-sqs.zip deployment-paketti

```shell
cd cloudwatch-to-sqs
zip -r cloudwatch-to-sqs.zip cloudwatch-to-sqs.py
```

### 2. Luo infrastruktuuri

```shell
cd <ympäristökansio dev, qa tai prod>
terraform apply
```