FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml /app/
RUN pip install --upgrade pip && pip install -e .

COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app
