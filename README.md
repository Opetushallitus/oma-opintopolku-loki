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

### Manually interacting with the queue

Write to default queue:

`aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs send-message --queue-url http://localhost:9324/queue/default --message-body "Hello world"`

Read from default queue:

`aws --region eu-west-1 --endpoint-url http://localhost:9324 sqs receive-message --queue-url http://localhost:9324/queue/default --wait-time-seconds 10`
   
# Running tests

Set the following environment variables:

```
username=username
password=password
```

and run :

```
mvn test
```

# Compiling

`mvn package`

# TODO:

   * Read logs from SQS
   * Create fat jar
