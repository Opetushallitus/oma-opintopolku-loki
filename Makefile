help:
	»·@echo ""
	»·@echo "make snyk»- Run snyk dependency check"

snyk:
		npm install --no-save snyk
		./node_modules/.bin/snyk test --dev api/auditlog api/common api/whoami frontend parser
