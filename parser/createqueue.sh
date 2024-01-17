#!/bin/sh
echo "Creating the default SQS queue..."

until curl -H "Accept: application/json" -s "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000?Action=CreateQueue&QueueName=default"
do
    sleep 1
done
