#!/usr/bin/env python3
import os
import subprocess

os.chdir('/home/brian/project/game/md/v8/mockup/local')

# 重命名：中文 -> 英文
renames = [
    ('[C108] 機台首次設定.html', 'mockup_c108_machine_first_setup.html'),
    ('[C11] 開分洗分.html', 'mockup_c11_cash_operation.html'),
    ('[C70] 本地登入.html', 'mockup_c70_local_login.html'),
    ('[C87] 基本設定.html', 'mockup_c87_basic_settings.html'),
    ('[C87] 本機設定.html', 'mockup_c87_local_settings.html'),
    ('[L02] 機台狀態圖.html', 'mockup_l02_machine_status.html'),
    ('[L06] 機台狀態監控.html', 'mockup_l06_machine_monitor.html'),
    ('[L11] 遊戲列表檢視.html', 'mockup_l11_game_list.html'),
    ('[L34] 同步狀態檢視.html', 'mockup_l34_sync_status.html'),
]

for old, new in renames:
    if os.path.exists(old):
        os.rename(old, new)
        print(f"✓ {old} -> {new}")
    else:
        print(f"✗ Not found: {old}")

# Git add
os.chdir('/home/brian/project/game/md/v8')
subprocess.run(['git', 'add', '-A'], check=True)
print("\nGit add complete.")
