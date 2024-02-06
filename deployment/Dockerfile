FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /usr/src/app

RUN --mount=type=cache,target=/var/cache/apt \
	apt-get update && \
    apt-get install --no-install-recommends -y build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*


COPY backend/requirements ./requirements

ARG APP_MODE

RUN echo $APP_MODE

RUN --mount=type=cache,target=/root/.cache/pip

RUN if [ "$APP_MODE" = "test" ]; then \
    pip install pip --upgrade \
    && pip install --no-cache-dir -r requirements/requirements.test.txt; fi
RUN if [ "$APP_MODE" = "dev" ]; then \
    pip install pip --upgrade \
    && pip install --no-cache-dir -r requirements/requirements.dev.txt; fi
RUN if [ "$APP_MODE" = "prod" ]; then \
    pip install pip --upgrade \
    && pip install --no-cache-dir -r requirements/requirements.txt; fi


COPY deployment/scripts /app/deployment/scripts

RUN chmod -R +x /app/deployment/scripts/*

COPY backend/ ./