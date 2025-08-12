import os, time, sys
import psycopg
from urllib.parse import urlparse

# Expect SQLAlchemy URL like postgresql+psycopg://user:pass@host:5432/db
url = os.environ.get("DATABASE_URL")
if not url:
    print("DATABASE_URL not set", file=sys.stderr)
    sys.exit(1)

# Convert to psycopg dsn
if "postgresql+psycopg://" in url:
    pg = url.replace("postgresql+psycopg://", "postgresql://")
else:
    pg = url

attempts = 30
for i in range(1, attempts + 1):
    try:
        with psycopg.connect(pg, connect_timeout=2) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                print("DB is ready.")
                sys.exit(0)
    except Exception as e:
        print(f"[wait_for_db] attempt {i}/{attempts} failed: {e}")
        time.sleep(1)

print("DB not ready after retries", file=sys.stderr)
sys.exit(1)
