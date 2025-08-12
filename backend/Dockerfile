FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# Python deps
COPY pyproject.toml /app/
RUN pip install --upgrade pip && pip install -e .

# App code
COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app
