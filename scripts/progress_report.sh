#!/bin/bash
export TEAM_TASKS_DIR=~/.openclaw/workspace/team-tasks/data
export PATH=$PATH:/home/brian/.nvm/versions/node/v24.13.0/bin
cd ~/project/game
python3 ~/.openclaw/skills/team-tasks/scripts/task_manager.py status game-v6-std > ~/.openclaw/workspace/main/last_progress.txt 2>&1
