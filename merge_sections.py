import re

file_path = "md/v8/遊戲平台管理系統_功能矩陣與流程圖_旗艦版.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

path_map = {}
mockup_map = {}

# Parse section 3.x to build a dictionary of Cxx/Lxx -> file path and mockup
section_3_start = content.find("## 3.1 ")
if section_3_start != -1:
    section_3_content = content[section_3_start:]
    
    # Regex for table rows with 3 columns, where first column starts with [C or [L
    row_pattern = re.compile(r'\|\s*\[([CL]\d+)\]\s*\|\s*([^\|]+)\s*\|\s*([^\|]+)\s*\|')
    
    for match in row_pattern.finditer(section_3_content):
        code = match.group(1).strip()
        paths_col = match.group(3).strip()
        
        # Extract file path: `feature_docs...`
        fd_match = re.search(r'(`[^`]+`)', paths_col)
        # Extract mockup: [mockup...](...)
        mu_match = re.search(r'(\[mockup[^\]]+\]\([^)]+\))', paths_col)
        
        fd = fd_match.group(1) if fd_match else "-"
        mu = mu_match.group(1) if mu_match else "-"
        
        path_map[f"[{code}]"] = fd
        mockup_map[f"[{code}]"] = mu

def update_tables(part_content):
    lines = part_content.split('\n')
    new_lines = []
    
    in_table = False
    for line in lines:
        if re.match(r'^\|\s*功能代碼\s*\|\s*功能名稱\s*\|\s*操作路徑\s*\|\s*備註\s*\|$', line):
            line = "| 功能代碼 | 功能名稱 | 操作路徑 | 文件路徑 | Mockup | 備註 |"
            in_table = True
            new_lines.append(line)
            continue
            
        if in_table and re.match(r'^\|[\s\-]+\|[\s\-]+\|[\s\-]+\|[\s\-]+\|$', line):
            line = "| --- | --- | --- | --- | --- | --- |"
            new_lines.append(line)
            continue
            
        row_match = re.match(r'^\|\s*(\[[CL]\d+\])?\s*\|\s*([^\|]*)\s*\|\s*([^\|]*)\s*\|\s*([^\|]*)\s*\|$', line)
        
        if in_table and row_match:
            code = row_match.group(1)
            if code is None:
                code_str = ""
            else:
                code_str = code.strip()
                
            name = row_match.group(2).strip()
            op_col = row_match.group(3).strip()
            remark = row_match.group(4).strip()
            
            if not code_str and name.startswith("**"):
                # Module header
                inner = name.strip('* ')
                line = f"| **{inner}** | | | | | |"
            elif code_str:
                # Regular row
                # Split op_col into operation path and mockup:
                op_mu_match = re.search(r'(.*?)(\[mockup[^\]]+\]\([^)]+\))(.*)', op_col)
                if op_mu_match:
                    op_path = op_mu_match.group(1).strip()
                    mockup = op_mu_match.group(2).strip()
                else:
                    op_path = op_col
                    mockup = ""
                    
                file_path = path_map.get(code_str, "-")
                if not mockup and mockup_map.get(code_str) and mockup_map.get(code_str) != "-":
                    mockup = mockup_map.get(code_str)
                    
                if not mockup:
                    mockup = "-"
                if not op_path:
                    op_path = "-"
                    
                line = f"| {code_str} | {name} | {op_path} | {file_path} | {mockup} | {remark} |"
                
        elif line.strip() == "":
            in_table = False
            
        new_lines.append(line)
    return "\n".join(new_lines)


end_of_sec1 = content.find("## 1.3 ")
sec1_content = content[:end_of_sec1]
rest_content = content[end_of_sec1:]

updated_sec1 = update_tables(sec1_content)

start_of_sec3 = rest_content.find("# 3. 詳細功能文件對應 (Feature Docs)")
if start_of_sec3 != -1:
    end_of_sec3 = rest_content.find("## 附錄：功能矩陣欄位說明", start_of_sec3)
    if end_of_sec3 != -1:
        rest_content = rest_content[:start_of_sec3] + rest_content[end_of_sec3:]
    else:
        rest_content = rest_content[:start_of_sec3]

new_content = updated_sec1 + rest_content

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated Section 1 with 6 columns and removed Section 3.")
