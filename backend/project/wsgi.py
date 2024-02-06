"""
WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

APP_MODE = os.getenv('APP_MODE', 'dev')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'project.settings.{APP_MODE}')

application = get_wsgi_application()
