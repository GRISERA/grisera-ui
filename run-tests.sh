#!/bin/sh

echo "Running tests with args: $@"

docker compose -f docker-compose.tests.yaml run --rm playwright-tests "$@"
