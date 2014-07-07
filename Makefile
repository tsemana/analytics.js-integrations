
#
# Helpers to test only a specific `integration` or `browser`, or on a `port`.
#

integration ?= *
browser ?= ie10
port ?= 4202

#
# Binaries.
#

tests = /test
duo = node_modules/.bin/duo
phantomjs = node_modules/.bin/duo-test phantomjs $(tests) args: \
	--setting local-to-remote-url-access=true \
	--setting web-security=false \
	--path node_modules/.bin/phantomjs

#
# Commands.
#

default: build/build.js

test: node_modules build/build.js server
	@node bin/tests
	@$(phantomjs)

test-browser: build/build.js server
	@node bin/tests
	@node_modules/.bin/duo-test browser --commands "make default" $(tests) default

test-sauce: node_modules build/build.js server
	@node bin/tests
	@node_modules/.bin/duo-test saucelabs $(tests) \
		--name analytics.js-integrations \
		--browser $(browser)

clean:
	@rm -rf build components integrations.js node_modules test/tests.js

kill:
	@if [ -a test/pid.txt ]; \
		then if ps -p `cat test/pid.txt` > /dev/null; \
			then kill `cat test/pid.txt` &> /dev/null; \
		fi; \
		rm -f test/pid.txt; \
	fi;

server: kill node_modules
	@port=$(port) node test/server.js &> /dev/null &
	@sleep 1

#
# Targets.
#

build/build.js: node_modules integrations.js $(wildcard *.js lib/*/*.js test/*.js)
	@node bin/tests
	@$(duo) --development test/index.js build/build.js

integrations.js: $(wildcard lib/*)
	@node bin/integrations

node_modules: package.json
	@npm install

#
# Phonies.
#

.PHONY: clean
.PHONY: kill
.PHONY: server
.PHONY: test
.PHONY: test-browser
.PHONY: test-coverage
.PHONY: test-sauce
