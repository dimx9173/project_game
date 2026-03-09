import sys
import re

filepath = 'md/v8/遊戲平台管理系統_功能矩陣與流程圖_旗艦版.md'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix Chapter 3 headers: "## 3.3 [M02] 機台管理" -> it contains both CM and LM features.
    # The user asks why LMxx/CMxx codes were changed back to Mxx.
    # Previously they might have been named: "## 3.3 [CM02] / [LM02] 機台管理" or simply we just revert M to CM/LM where appropriate.
    # Let's check how they were named in the previous commit.
    # Wait, in the prev commit:
    # `## 3.2 [M01] 儀表板`
    # They were actually `[M01]`!
    
    # Wait, the issue is that in the function matrix:
    # `| **[M02] 機台管理** ` was changed to `| **[LM02] 機台管理** ` and then back?
    # No, the directories were changed from `feature_docs/local/[LM...` to `feature_docs/local/[M...`
    # This matches the user's question: "为何LMxx/CMxx代码又被改回Mxx ?" (Why were LMxx/CMxx codes changed back to Mxx in feature_docs?)
    
    # We already reverted the folder names to CMxx and LMxx.
    # Now let's ensure all the links match the folder names.
    
    # [C...] lines should point to central/[CM...]
    if '| [C' in line and 'feature_docs/central/[CM' not in line:
        line = re.sub(r'feature_docs/\[?C?M(\d{2})\]?', r'feature_docs/central/[CM\1]', line)
        line = re.sub(r'feature_docs/central/\[M(\d{2})\]', r'feature_docs/central/[CM\1]', line)
    
    # [L...] lines should point to local/[LM...]
    if '| [L' in line and 'feature_docs/local/[LM' not in line:
        line = re.sub(r'feature_docs/\[?L?M(\d{2})\]?', r'feature_docs/local/[LM\1]', line)
        line = re.sub(r'feature_docs/central/\[C?M(\d{2})\]', r'feature_docs/local/[LM\1]', line)
        line = re.sub(r'feature_docs/local/\[M(\d{2})\]', r'feature_docs/local/[LM\1]', line)
        
    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Markdown links fixed.")
