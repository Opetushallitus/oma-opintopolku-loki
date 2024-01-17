APP_NAME = oma-opintopolku-loki
LOCALSTACK_RUNNING := $(shell docker inspect -f {{.State.Running}} $(APP_NAME)-localstack 2> /dev/null)

help:
	@echo ""
	@echo "make deploy env=<env> - Package current version of lambda function and deploy to environment <env>"
	@echo "make localstack       - Start LocalStack instance"
	@echo "make localstack-debug - Start LocalStack instance in debug mode"
	@echo "make localstack-stop  - Stop LocalStack instance"
	@echo "make package          - Package current version of lambda function into JAR file"
	@echo "make scalastyle       - Run style-check for Scala code"
	@echo "make test             - Run unit tests"
	@echo "make sqs-queue        - Make default SQS queue to LocalStack"

localstack:
ifeq ($(LOCALSTACK_RUNNING), true)
	@echo "LocalStack already running..."
else
	@echo "Starting LocalStack:"
	@docker run --rm -d --name $(APP_NAME)-localstack -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
endif

localstack-debug:
ifeq ($(LOCALSTACK_RUNNING), true)
	@echo "LocalStack already running..."
else
	@echo "Starting LocalStack in debug mode:"
	@docker run --rm -it --name $(APP_NAME)-localstack -p 4566:4566 -p 4510-4559:4510-4559 -e "LS_LOG=trace" localstack/localstack
endif

localstack-stop:
ifeq ($(LOCALSTACK_RUNNING), true)
	@echo "Stopping LocalStack instances:"
	@docker stop $(APP_NAME)-localstack
else
	@echo "LocalStack already stopped."
endif

sqs-queue: localstack
	@./createqueue.sh

package: sqs-queue
	@mvn package

test: sqs-queue
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
