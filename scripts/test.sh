#!/bin/bash -e

docker exec -it $backend_app_name sh "-c" \
	"coverage run ./manage.py test && coverage report -m"