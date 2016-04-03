BIN = ./node_modules/.bin

.PHONY: all
all: coverage

.build:
	mkdir -p $@

.build/sources: .build $(shell find src/ -type f -name '*.js$$')
	touch $@

.build/tests: .build $(shell find test/ -type f -name '*.js$$')
	touch $@

.build/install: .build package.json
	npm install
	touch $@

coverage/lcov.info: .build/sources .build/tests $(BIN)/_mocha $(BIN)/istanbul
	$(BIN)/istanbul cover $(BIN)/_mocha

.PHONY: test
test: .build/sources $(BIN)/mocha
	$(BIN)/mocha

.PHONY: coverage
coverage: coverage/lcov.info

.PHONY: report
report: coverage
	open coverage/lcov-report/index.html

$(BIN)/istanbul: .build/install

$(BIN)/mocha: .build/install

$(BIN)/_mocha: .build/install

.PHONY: clean
clean: clean-coverage clean-sources clean-tests clean-install

.PHONY: clean-coverage
clean-coverage:
	-rm -rf coverage

.PHONY: clean-sources
clean-sources:
	-rm -rf .build/sources

.PHONY: clean-tests
clean-tests:
	-rm -rf .build/tests

.PHONY: clean-install
clean-install:
	-rm -rf .build/install \
	node_modules