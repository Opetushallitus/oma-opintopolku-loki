APP_NAME = oma-opintopolku-loki
DYNAMODB_RUNNING := $(shell docker inspect -f {{.State.Running}} $(APP_NAME)-dynamodb 2> /dev/null)
AWS_ACCOUNT_ID := $(shell aws --profile oph-koski-dev sts get-caller-identity | jq --raw-output '.Account')

help:
	@echo ""
	@echo "make deploy env=<env> - Package current versions of lambda functions and deploy to environment <env>"
	@echo "make deps             - Install dependencies of all lambda functions"
	@echo "make dynamodb-start   - Start local DynamoDB instance"
	@echo "make dynamodb-stop    - Stop local DynamoDB instance"
	@echo "make test             - Run unit tests of lambda functions"
	@echo "make clean            - Remove build artifacts"

clean:
	find . -name "node_modules" -d -depth 3 -exec rm -rf {} \;

deps:
	@cd auditlog && npm i
	@cd common && npm i
	@cd whoami && npm i

dynamodb-start:
ifeq ($(DYNAMODB_RUNNING), true)
	@echo "DynamoDB already running..."
else
	@echo "Starting DynamoDB instance..."
	@docker run -d --name $(APP_NAME)-dynamodb -p 8000:8000 amazon/dynamodb-local 1> /dev/null
	@echo "DynamoDB started."
endif

dynamodb-stop:
ifeq ($(DYNAMODB_RUNNING), true)
	@echo "Stopping DynamoDB instances:"
	@docker stop $(APP_NAME)-dynamodb | xargs docker rm 2> /dev/null
else
	@echo "DynamoDB already stopped."
endif

test: dynamodb-start
	@cd auditlog && npm test -- --coverage
	@cd whoami && npm test -- --coverage

deploy: clean deps test
ifndef env
	@echo "Usage: make deploy env=<dev|qa|prod>"
else
	AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID} ./common/node_modules/.bin/sls deploy --stage $(env) --aws-profile oph-koski-$(env)
endif
