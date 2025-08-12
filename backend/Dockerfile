FROM python:3.11-slim

WORKDIR /app

# Faster, quieter pip installs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

# Install Python deps directly (no system packages needed)
RUN pip install --upgrade pip && \
    pip install \
      "fastapi==0.111.0" \
      "uvicorn[standard]==0.30.0" \
      "sqlalchemy==2.0.30" \
      "psycopg[binary]==3.2.1" \
      "alembic==1.13.2" \
      "pydantic==2.7.4" \
      "pydantic-settings==2.3.4" \
      "passlib[argon2]==1.7.4" \
      "pyjwt==2.8.0" \
      "python-multipart==0.0.9"

# Copy app after deps for better caching
COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app

CMD ["sh","-c","alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
