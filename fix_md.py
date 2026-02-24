import glob
import re

for filepath in glob.glob("md/v6/*.md"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Rule MD025: Multiple H1.
    # Change `# 1. `, `# 2. ` etc to `## 1. `, `## 2. `
    # But ONLY if there is already an H1 at the very top.
    lines = content.split('\n')
    has_h1 = False
    new_lines = []
    for line in lines:
        if line.startswith('# '):
            if not has_h1:
                has_h1 = True
                new_lines.append(line)
            else:
                new_lines.append('#' + line)
        elif line.startswith('## '):
            # We indent all other headers as well to keep hierarchy if we bumped the top ones
            if re.match(r'^## \d+\.', line):
                new_lines.append('#' + line)
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    
    content = '\n'.join(new_lines)

    # Rule MD003, MD035, MD023 related to `----` used under text
    # Replace lines with just `-` or ` ` and `-` with nothing if they are after text,
    # or just replace them with a standard HR `---` with empty lines around.
    # A simple way to avoid setext header is to ensure a blank line before `---`
    content = re.sub(r'([^\n])\n\s*-{3,}\s*', r'\1\n\n---', content)
    content = re.sub(r'-{3,}(?:\s+-{3,})+', r'---', content)

    # Rule MD036: Emphasis used instead of a heading
    # e.g., `**玩家（Player）**\n`
    content = re.sub(r'\*\*(.+?)\*\*\n', r'### \1\n', content)

    # Rule MD024: Duplicate heading
    # Make duplicate headers unique by adding a space or invisible char (or just let it be, markdownlint might still complain, so we can ignore MD024)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

