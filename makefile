# -------- Personalized Learning MVP convenience targets --------

SHELL := /bin/bash

.PHONY: help daily weekly docs-commit

help:
	@echo "Usage:"
	@echo "  make daily   - Create today's progress file and update PROGRESS_LOG.md"
	@echo "  make weekly  - Generate/refresh the current week's summary block"
	@echo "  make docs-commit - Git add & commit progress docs"

daily:
	@./scripts/new_progress_log.sh

weekly:
	@./scripts/gen_weekly_summary.sh

docs-commit:
	@git add PROGRESS_LOG.md progress scripts || true
	@git commit -m "docs: update progress logs" || true
	@echo "✅ Docs committed (or nothing to commit)."

