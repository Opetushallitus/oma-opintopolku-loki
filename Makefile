help:
	»·@echo ""
	»·@echo "make snyk»- Run snyk dependency check"

snyk:
		npm install --no-save snyk
		./node_modules/.bin/snyk test frontend parser

test:
	cd parser; make test
