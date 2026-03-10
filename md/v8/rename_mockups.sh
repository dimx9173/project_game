#!/bin/bash

# Mockup HTML 文件重命名腳本 - 中文檔名轉英文

cd ~/project/game/md/v8

# Local Mockups
declare -A local_map=(
    ["[L34] 同步狀態檢視.html"]="mockup_l34_sync_status.html"
    ["[L02] 機台狀態圖.html"]="mockup_l02_machine_status.html"
    ["[L06] 機台狀態監控.html"]="mockup_l06_machine_monitor.html"
    ["[C87] 基本設定.html"]="mockup_c87_basic_settings.html"
    ["[C108] 機台首次設定.html"]="mockup_c108_machine_first_setup.html"
    ["[C70] 本地登入.html"]="mockup_c70_local_login.html"
    ["[C11] 開分洗分.html"]="mockup_c11_cash_operation.html"
    ["[L11] 遊戲列表檢視.html"]="mockup_l11_game_list.html"
    ["[C87] 本機設定.html"]="mockup_c87_local_settings.html"
)

# 重命名 Local 文件
for old in "${!local_map[@]}"; do
    new="${local_map[$old]}"
    if [ -f "mockup/local/$old" ]; then
        mv "mockup/local/$old" "mockup/local/$new"
        echo "Renamed: $old -> $new"
    fi
done

echo "Done!"
