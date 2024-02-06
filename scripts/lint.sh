#!/bin/bash -e

docker exec -it $backend_app_name sh "-c" \
	"ruff check ."