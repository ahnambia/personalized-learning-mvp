#!/usr/bin/env bash
set -euo pipefail

TODAY=$(date +%F)          # YYYY-MM-DD
PROGRESS_DIR="progress"
LOG_FILE="$PROGRESS_DIR/$TODAY.md"
PROGRESS_LOG="PROGRESS_LOG.md"

mkdir -p "$PROGRESS_DIR"

# 1) Create today's daily file if missing (won't overwrite)
if [[ ! -f "$LOG_FILE" ]]; then
  cat > "$LOG_FILE" <<EOL
# 🗓 Progress — $TODAY

**Status:** 🟢 On Track

---

## ✅ Focus Areas
- 

---

## 📈 Progress Summary
- 

---

## 📌 Key Decisions
- 

---

## ⚠️ Challenges / Blockers
- 

---

## 🎯 Next Steps
- [ ] 

---

## 📝 Notes / Learnings
- 
EOL
  echo "✅ Created $LOG_FILE"
else
  echo "ℹ️  $LOG_FILE already exists; not overwriting."
fi

# 2) Ensure PROGRESS_LOG.md exists with headers
if [[ ! -f "$PROGRESS_LOG" ]]; then
  cat > "$PROGRESS_LOG" <<'EOL'
# 📄 Personalized Learning MVP — Progress Overview

---

## 📌 Project Info
- **Project Name:** Personalized Learning MVP
- **Owner:** Abhiram Nambiar
- **Team:** Backend / Fullstack (Solo Development)
- **Start Date:** 12 Aug 2025
- **Goal:** Build backend + frontend MVP for Personalized Learning platform
- **Tech Stack:** FastAPI, PostgreSQL, Docker, React, Vite, Alembic, SQLAlchemy

---

## 📅 Daily Logs
| Date | Status | Summary |
|------|--------|---------|
EOL
  echo "✅ Created $PROGRESS_LOG with headers"
fi

# 3) Add today's row to the Daily Logs table if not already present
LINK="[$TODAY]($PROGRESS_DIR/$TODAY.md)"
ROW="| $LINK | ⏳ Planned | TBD |"

if ! grep -q "\[$TODAY\]" "$PROGRESS_LOG"; then
  # Insert after the table header (line starting with |------ )
  awk -v row="$ROW" '
    BEGIN{added=0}
    {print}
    /^\|[- ]+\|[- ]+\|[- ]+\|$/ && !added {print row; added=1}
    END{if(!added){print ""; print row}}
  ' "$PROGRESS_LOG" > "$PROGRESS_LOG.tmp" && mv "$PROGRESS_LOG.tmp" "$PROGRESS_LOG"
  echo "✅ Added today to PROGRESS_LOG.md"
else
  echo "ℹ️  PROGRESS_LOG.md already has an entry for $TODAY"
fi

echo "�� Done."

git add "$LOG_FILE" "$PROGRESS_LOG"
git commit -m "docs: add daily progress log for $TODAY" || true

