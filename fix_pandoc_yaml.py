import glob
import re

for filepath in glob.glob("md/v6/*.md"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace `---` followed by text with just the text
    content = re.sub(r'^---([^\-\n])', r'\1', content, flags=re.MULTILINE)
    # Replace lines with only `-` (3 or more) with `***`
    content = re.sub(r'^-{3,}\s*$', r'***', content, flags=re.MULTILINE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

