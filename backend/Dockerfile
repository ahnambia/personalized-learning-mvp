FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY pyproject.toml .

# Install Python dependencies directly without system packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    sqlalchemy \
    alembic \
    psycopg[binary] \
    pydantic[email] \
    pydantic-settings \
    "passlib[bcrypt]>=1.7.4" \
    "bcrypt>=4.0.0" \
    pyjwt \
    python-multipart

# Copy the rest of the application
COPY . .

# Install the application in development mode
RUN pip install -e .

# Expose port
EXPOSE 8000

# Command will be overridden by docker-compose
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
