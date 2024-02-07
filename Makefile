include .env
export $(shell sed 's/=.*//' .env)

SHELL := /bin/sh
PROJECTNAME ?= default_app_name
APP_NAME := $(PROJECTNAME)
BACKEND_APP_NAME := $(APP_NAME)-backend

export project_name=$(PROJECTNAME)
export backend_app_name=$(BACKEND_APP_NAME)
export app_name=$(APP_NAME)

define HELP

Manage $(PROJECTNAME). Usage:

make lint           	Run linter
make format         	Run formatter
make test           	Run tests
make coverage 			Run coverage
make coverage-report	Generate coverage report
make super-user     	Create super user
make make-migrations 	Make migrations
make migrate        	Migrate
make build-dev      	Build and run dev environment
make stop-dev       	Stop dev environment
make stop-prod      	Stop prod environment
make build-prod     	Build and run prod environment
make all            	Show help

endef

export HELP

.PHONY: help
help:
	@echo "$$HELP"

.PHONY: lint
lint:
	@bash ./scripts/lint.sh

.PHONY: format
format:
	@bash ./scripts/format.sh

.PHONY: test
test:
	@bash ./scripts/test.sh

.PHONY: coverage
coverage:
	docker exec -it $(BACKEND_APP_NAME) sh "-c" \
	"coverage run ./manage.py test"

.PHONY: coverage-report
coverage-report:
	docker exec -it $(BACKEND_APP_NAME) sh "-c" \
	"coverage run ./manage.py test && coverage report -m"

.PHONY: super-user
super-user:
	docker exec -it $(BACKEND_APP_NAME) sh "-c" \
	"python manage.py createsuperuser"

.PHONY: make-migrations
make-migrations:
	docker exec -it $(BACKEND_APP_NAME) $(SHELL) "-c" \
	"python manage.py makemigrations"

.PHONY: make-migrate
make-migrate:
	docker exec -it $(BACKEND_APP_NAME) $(SHELL) "-c" \
	"python manage.py migrate"

.PHONY: build-dev
build-dev:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-compose.yml up --build -d

.PHONY: build-prod
build-prod:
	DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-compose.yml up --build -d

.PHONY: stop-dev
stop-dev:
	@docker-compose -f docker-compose.yml down

.PHONY: stop-prod
stop-prod:
	@docker-compose -f docker-compose.yml down

.PHONY: all
all: help