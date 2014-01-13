
BROWSERS ?= 'ie6..11, safari, chrome, firefox, iphone, opera'
tests ?= *
test = http://localhost:4202
component = node_modules/component/bin/component
phantom = node_modules/.bin/mocha-phantomjs --setting web-security=false --setting local-to-remote-url-access=true

build: node_modules components $(shell find lib)
	@$(component) build --dev

clean:
	@rm -rf build components node_modules

components: component.json
	@$(component) install --dev

kill:
	@-test ! -s test/pid.txt || kill `cat test/pid.txt` &> /dev/null
	@-rm -f test/pid.txt

node_modules: package.json
	@npm install &> /dev/null

server: build kill
	@tests=$(tests) node test/server &> /dev/null &

test: build server
	@sleep 1
	@$(phantom) $(test)
	@make kill

test-browser: node_modules build server
	@sleep 1
	@open $(test)

test-coverage: node_modules build server
	@sleep 1
	@open $(test)/coverage

test-sauce: node_modules build server
	@sleep 1
	@BROWSERS=$(BROWSERS) node_modules/.bin/gravy --url $(test)

.PHONY: clean server test test-browser test-coverage test-sauce
