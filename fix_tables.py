import sys, glob, re

for file_path in glob.glob("md/v6/*.md"):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()

    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        if not line.strip():
            new_lines.append(line)
            i += 1
            continue
            
        def get_cols(text):
            return [c.strip() for c in re.split(r'\s{2,}', text.strip()) if c.strip()]
            
        def is_sep(text):
            s = text.strip()
            return bool(re.match(r'^[\-\*\s]+$', s)) and len(s) >= 3
            
        cols = get_cols(line)
        if len(cols) >= 2 and not line.startswith('#'):
            is_table = False
            lookahead_i = i + 1
            while lookahead_i < len(lines) and not lines[lookahead_i].strip():
                lookahead_i += 1
            if lookahead_i < len(lines) and is_sep(lines[lookahead_i]):
                is_table = True
                
            if is_table:
                new_lines.append("| " + " | ".join(cols) + " |")
                new_lines.append("|" + "|".join(["---"] * len(cols)) + "|")
                
                i = lookahead_i + 1
                while i < len(lines):
                    r_line = lines[i]
                    if not r_line.strip():
                        i += 1
                        continue
                    if is_sep(r_line):
                        i += 1
                        continue
                    if r_line.startswith('#'):
                        break
                    
                    r_cols = get_cols(r_line)
                    if len(r_cols) >= 2:
                        while len(r_cols) < len(cols):
                            r_cols.append("")
                        new_lines.append("| " + " | ".join(r_cols[:len(cols)]) + " |")
                        i += 1
                    else:
                        break
                continue
                
        new_lines.append(line)
        i += 1

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines) + '\n')
    print(f"Processed {file_path}")
