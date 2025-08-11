# Personalized Learning MVP — Backend (Phase 1 Starter)

## Quick start
1. `cp .env.example .env` and edit values if needed.
2. `docker compose up --build`
3. Open API docs: http://localhost:8000/docs

## Auth flow
- `POST /auth/signup` {email, password, display_name}
- `POST /auth/login` {email, password}
- `GET /me` with `Authorization: Bearer <access>`
- `POST /auth/refresh` uses httpOnly cookie set by login/signup
- `POST /auth/logout`

## Catalog
- `GET /skills?domain=dsa`
- `GET /content?q=array&type=article&min_diff=2&max_diff=4`

## Notes
- Postgres image includes pgvector (for Phase 2).
- Alembic runs automatically on container start.
- Change `JWT_SECRET` in production.
