import re

with open("/Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My Drive/老公與老婆分享/專案/遊戲平台管理/md/v8/遊戲平台管理系統_功能矩陣與流程圖_旗艦版.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_table = False
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped.startswith("|"):
        in_table = True
    elif in_table and stripped == "":
        # Check if the next line also starts with a |
        next_is_table = False
        for j in range(i+1, min(i+5, len(lines))):
            next_stripped = lines[j].strip()
            if next_stripped.startswith("|"):
                next_is_table = True
                print(f"Broken table around line {i+1} (blank) followed by table line {j+1}: {next_stripped}")
                break
            elif next_stripped != "":
                break
        in_table = False

