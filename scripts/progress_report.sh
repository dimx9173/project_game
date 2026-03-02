#!/bin/bash
# OpenClaw Team-Tasks Progress Reporter
OPENCLAW="/home/brian/.nvm/versions/node/v24.13.0/bin/openclaw"
TM_SCRIPT="/home/brian/.openclaw/skills/team-tasks/scripts/task_manager.py"
TARGET_ID="1005486276"

# Get status of all active projects
STATUS=$(python3 "$TM_SCRIPT" status game-v6-std)

# Add a header and send to Telegram
MESSAGE="📊 **Team-Tasks 定時進度回報**

$STATUS"

"$OPENCLAW" message send --channel telegram --target "$TARGET_ID" --message "$MESSAGE"
