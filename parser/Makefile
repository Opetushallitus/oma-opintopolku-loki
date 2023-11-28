APP_NAME = oma-opintopolku-loki
DYNAMODB_RUNNING := $(shell docker inspect -f {{.State.Running}} $(APP_NAME)-dynamodb 2> /dev/null)
SQS_RUNNING := $(shell docker inspect -f {{.State.Running}} $(APP_NAME)-sqs 2> /dev/null)

help:
	@echo ""
	@echo "make deploy env=<env> - Package current version of lambda function and deploy to environment <env>"
	@echo "make docker-up        - Start all Docker containers"
	@echo "make docker-down      - Stop all Docker containers"
	@echo "make dynamodb-start   - Start local DynamoDB instance"
	@echo "make dynamodb-stop    - Stop local DynamoDB instance"
	@echo "make package          - Package current version of lambda function into JAR file"
	@echo "make scalastyle       - Run style-check for Scala code"
	@echo "make sqs-start        - Start local SQS instance"
	@echo "make sqs-stop         - Stop local SQS instance"
	@echo "make test             - Run unit tests"

dynamodb-start:
ifeq ($(DYNAMODB_RUNNING), true)
	@echo "DynamoDB already running..."
else
	@echo "Starting DynamoDB instance..."
	-@docker rm --force $(APP_NAME)-dynamodb 2> /dev/null || true
	@docker run -d --name $(APP_NAME)-dynamodb -p 8000:8000 amazon/dynamodb-local:1.13.4 1> /dev/null
	@echo "DynamoDB started."
endif

dynamodb-stop:
ifeq ($(DYNAMODB_RUNNING), true)
	@echo "Stopping DynamoDB instances:"
	@docker stop $(APP_NAME)-dynamodb | xargs docker rm 2> /dev/null
else
	@echo "DynamoDB already stopped."
endif

sqs-start:
ifeq ($(SQS_RUNNING), true)
	@echo "SQS already running..."
else
	@echo "Starting SQS..."
	-@docker rm --force $(APP_NAME)-sqs 2> /dev/null || true
	@docker run -d --name $(APP_NAME)-sqs -p 9324:9324 -p 9325:9325 -d roribio16/alpine-sqs:1.0.0 1> /dev/null
	@echo "SQS started."
endif

sqs-stop:
ifeq ($(SQS_RUNNING), true)
	@echo "Stopping SQS:"
	@docker stop $(APP_NAME)-sqs | xargs docker rm 2> /dev/null
else
	@echo "SQS already stopped."
endif

docker-up: dynamodb-start sqs-start

docker-down: dynamodb-stop sqs-stop

package: docker-up
	@mvn package

test: docker-up
	@mvn test

scalastyle:
	@mvn scalastyle:check

deploy: package
ifndef env
	@echo "Usage: make deploy <dev|qa|prod>"
else ifeq ($(GITHUB_ACTIONS),true)
	npx serverless@3.19.0 deploy --stage $(env)
else
	npx serverless@3.19.0 deploy --stage $(env) --aws-profile oph-koski-$(env)
endif

.PHONY: owasp
owasp:
	mvn dependency-check:check -P owasp
