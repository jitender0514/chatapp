# django-quickstart

This quickstart provides an easy django + Docker + Postgres setup to initialize the application.


## Features

- **Django** web application framework
- **PostgreSQL** database


## Included Packages and Tools 🛠️

- **Coverage**: Test coverage tool
- **Ruff**: Linter
- **Black**: Code formatter

## Requirements 📋

- Docker & Docker Compose - [Install and Use Docker](https://www.tutorialspoint.com/docker/docker_installation.htm)
- Python 3.11 or higher - [Download and install Python](https://www.python.org/downloads/)
- Make (optional for shortcuts) - [Configure and usage of Makefile](https://earthly.dev/blog/docker-and-makefiles/)

---

## Getting Started 🏁

1. **Clone the repository:**
    ```bash
    git clone https://github.com/jitender0514/django-quickstart.git
    ```

2. **Change directory into the project:**
    ```bash
    cd django-quickstart
    ```

3. **Copy the `env.example` file to `.env` and update the values as needed:**  

   - **For Linux/macOS:**  
     ```bash
     cp env.example .env
     ```
   - **For Windows (Command Prompt):**  
     ```cmd
      Copy-Item -Path env.example -Destination .env
     ```

---

## How to  Setup

### Development Prerequisites

1. **Create a virtual environment:**
    ```bash
    python -m venv ENV
    ```

2. **Activate the virtual environment:**
    ```bash
    source ENV/bin/activate
    ```

3. **(Optional) Install the development requirements specific to your IDE for enhanced functionality and support [Use `Make` command for easy setup].**
    ```bash
    pip install -r backend/requirements/requirements.dev.txt
    ```

4. **Build the image and run the container:**  
   
   - If buildkit is not enabled, enable it and build the image:
     ```bash
     DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-compose.yml up --build -d
     ```
   
   - If buildkit is enabled, build the image:
     ```bash
     docker-compose -f docker-compose.yml up --build -d
     ```
   
   - Or, use the shortcut (`RECOMMENDED` For easy setup)
     ```bash
     make build-dev
     ```

You can now access the application at http://localhost:8000. The development environment allows for immediate reflection of code changes.

### Production Setup

1. **Build the image and run the container:**  

   - If buildkit is not enabled, enable it and build the image:
     ```bash
       DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -f docker-compose.yml up --build -d
     ```

   - If buildkit is enabled, build the image:
     ```bash
      docker-compose -f docker-compose.yml up --build -d
     ```
   - Or, use the shortcut:
     ```bash
       make build-prod
     ```

---

## Shortcuts [Recommended for easy setup] 🔑

This project includes several shortcuts to streamline the development process:

- **Create migrations:**
    ```bash
    make make-migrations
    ```

- **Run migrations:**
    ```bash
    make migrate
    ```

- **Run the linter:**
    ```bash
    make lint
    ```

- **Run the formatter:**
    ```bash
    make format
    ```

- **Run the tests:**
    ```bash
    make test
    ```

- **Create a super user:**
    ```bash
    make super-user
    ```

- **Build and run dev environment:**
    ```bash
    make build-dev
    ```

- **Build and run prod environment:**
    ```bash
    make build-prod
    ```
---