# Audit log parser for Opintopolku audit logs

This application reads audit log entries from AWS SQS, 
resolves corresponding organizations and stores the information to a DB

# Requirements

## Redis

`apt-get install redis`

## DynamoDB

`docker run -p 8000:8000 amazon/dynamodb-local`   

After which you can access it from http://localhost:8000/shell/   
   
# Running tests

TODO

# Compiling

`mvn package`
