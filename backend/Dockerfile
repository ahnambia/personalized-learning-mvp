FROM python:3.11-slim

# Faster, quieter pip
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app

WORKDIR /app

# Install Python dependencies (no system compilers needed)
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

# Copy backend source after deps for better caching
COPY alembic.ini /app/
COPY alembic /app/alembic
COPY app /app/app

# Run migrations then start API
CMD ["sh","-c","alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
