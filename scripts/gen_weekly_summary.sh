#!/usr/bin/env bash
set -euo pipefail

# Run a Python helper so this works on macOS bash 3.x too.
python3 - <<'PY'
import os, re, datetime as dt, pathlib, sys

PROGRESS_DIR = pathlib.Path("progress")
PROGRESS_LOG = pathlib.Path("PROGRESS_LOG.md")

today = dt.date.today()
dates = [(today - dt.timedelta(days=i)) for i in range(0,7)]

# ISO week: Monday..Sunday range label
start = today - dt.timedelta(days=today.weekday())
end = start + dt.timedelta(days=6)
week_label = f"{start.isoformat()} to {end.isoformat()}"

# Ensure PROGRESS_LOG exists with a skeleton
if not PROGRESS_LOG.exists():
    PROGRESS_LOG.write_text(
        "# 📄 Personalized Learning MVP — Progress Overview\n\n"
        "## 📅 Daily Logs\n"
        "| Date | Status | Summary |\n"
        "|------|--------|---------|\n\n"
        "## 📊 Weekly Summaries\n\n",
        encoding="utf-8"
    )

rows = []
for d in dates:
    f = PROGRESS_DIR / f"{d.isoformat()}.md"
    if not f.exists():
        continue
    text = f.read_text(encoding="utf-8", errors="ignore")

    # Status line: **Status:** <value>
    m_status = re.search(r"^\*\*Status:\*\*\s*(.+)$", text, re.M)
    status = m_status.group(1).strip() if m_status else "—"

    # First bullet under "## 📈 Progress Summary"
    summary = "(see daily log)"
    m_prog = re.search(r"^##\s*📈\s*Progress Summary\s*$", text, re.M)
    if m_prog:
        start_idx = m_prog.end()
        # find the next heading or end
        m_next = re.search(r"^##\s", text[start_idx:], re.M)
        segment = text[start_idx: (start_idx + m_next.start())] if m_next else text[start_idx:]
        m_bullet = re.search(r"^\s*-\s+(.*)$", segment, re.M)
        if m_bullet:
            summary = m_bullet.group(1).strip()

    link = f"[{d.isoformat()}]({PROGRESS_DIR}/{d.isoformat()}.md)"
    rows.append(f"| {link} | {status} | {summary} |")

if not rows:
    print("No daily files found in the last 7 days.")
    sys.exit(0)

# Build the weekly table block
table = ["| Date | Status | Main Achievements |",
         "|------|--------|--------------------|"] + rows

start_mark = f"<!-- WEEK: {week_label} START -->"
end_mark   = f"<!-- WEEK: {week_label} END -->"
block = "\n".join([
    "", start_mark, "",
    f"### Week: {week_label}",
    *table, "",
    end_mark, ""
])

content = PROGRESS_LOG.read_text(encoding="utf-8", errors="ignore")

# Ensure Weekly Summaries header exists
if re.search(r"^##\s*📊\s*Weekly Summaries\s*$", content, re.M) is None:
    content = content.rstrip() + "\n\n## 📊 Weekly Summaries\n\n"

# Replace existing week block or append
pattern = re.compile(re.escape(start_mark) + r".*?" + re.escape(end_mark), re.S)
if pattern.search(content):
    content = pattern.sub(block, content)
else:
    # append at end
    content = content.rstrip() + "\n" + block

PROGRESS_LOG.write_text(content, encoding="utf-8")
print(f"✅ Weekly summary updated for: {week_label}")
PY

