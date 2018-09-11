# Audit log parser for Opintopolku audit logs

This application reads audit log entries from AWS SQS, 
resolves corresponding organizations and stores the information to a DB

# Requirements

## Redis

`apt-get install redis`

## DynamoDB

`docker run -p 8000:8000 amazon/dynamodb-local`

## SQS

`docker run --name alpine-sqs -p 9324:9324 -p 9325:9325 -d roribio16/alpine-sqs:latest`

After which you can access it from http://localhost:8000/shell/
   
# Running tests

Start Redis and run Docker DynamoDB and SQS containers, 

and run :

```
mvn test
```

# Running the application

Override default configurations from application.conf with environment specific variables.

Set the following environment variables: 
```
username=username
password=password
```

# Compiling

`mvn package`

# Interacting with services

## SQS

Write to default queue:

`aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs send-message --queue-url http://localhost:9324/queue/default --message-body "Hello world"`

Read from default queue:

`aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs receive-message --queue-url http://localhost:9324/queue/default --wait-time-seconds 10`


## DynamoDB

List tables:
`aws dynamodb list-tables --endpoint-url http://localhost:8000 --region eu-west-1`

List items:
 `aws dynamodb scan --table-name LogEntry --endpoint-url http://localhost:8000 --region eu-west-1`


## Redis

List keys:

`echo "keys *" | redis-cli`

# TODO:

   * Create fat jar
   * Check if failures are cached (redis) or not
   * Start Docker containers & Redis before running tests
   * Verify package name
   * Implement an integration test for organization repository
   * Code to Github, repo name "oma-opintopolku-loki"
   * Change package name to fi.oph.omaopintopolkuloki

