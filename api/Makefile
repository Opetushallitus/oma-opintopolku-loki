APP_NAME = oma-opintopolku-loki
DYNAMODB_RUNNING := $(shell docker inspect -f {{.State.Running}} $(APP_NAME)-dynamodb 2> /dev/null)

help:
	@echo ""
	@echo "make deploy env=<env> - Package current versions of lambda functions and deploy to environment <env>"
	@echo "make deps             - Install dependencies of all lambda functions"
	@echo "make dynamodb-start   - Start local DynamoDB instance"
	@echo "make dynamodb-stop    - Stop local DynamoDB instance"
	@echo "make test             - Run unit tests of lambda functions"

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

deploy:
ifndef env
	@echo "Usage: make deploy env=<dev|qa|prod>"
else
	./common/node_modules/.bin/sls deploy --stage $(env) --aws-profile oph-koski-$(env)
endif
