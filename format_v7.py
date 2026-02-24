import glob

for file_path in glob.glob("md/v7/*.md"):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the v6 version strings
    content = content.replace('v6.0', 'v7.0')
    content = content.replace('v6', 'v7')
    content = content.replace('V6', 'V7')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
