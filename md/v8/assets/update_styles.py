import os
import re

ASSETS_DIR = "/Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My Drive/老公與老婆分享/專案/遊戲平台管理/md/v8/assets"

replacements = {
    # Typography & Body Background (Replace inline style)
    r"body\s*\{\s*font-family:\s*'Noto Sans TC',\s*sans-serif;\s*background-color:\s*#[a-fA-F0-9]{3,6};\s*\}": "body { font-family: 'Roboto', 'Noto Sans TC', sans-serif; background-color: #F4F7F6; }",
    r"bg-gray-50": "bg-[#F4F7F6]",
    
    # Primary Colors (Deep Indigo base: #3F51B5)
    # Using Material Design 3 Indigo palette equivalents roughly mapped to Tailwind weights
    r"bg-indigo-900": "bg-[#283593]",
    r"text-indigo-900": "text-[#283593]",
    r"border-indigo-900": "border-[#283593]",
    
    r"bg-indigo-800": "bg-[#303F9F]",
    r"text-indigo-800": "text-[#303F9F]",
    r"border-indigo-800": "border-[#303F9F]",
    
    r"bg-indigo-700": "bg-[#3949AB]",
    r"text-indigo-700": "text-[#3949AB]",
    r"border-indigo-700": "border-[#3949AB]",
    
    r"bg-indigo-600": "bg-[#3F51B5]",
    r"text-indigo-600": "text-[#3F51B5]",
    r"border-indigo-600": "border-[#3F51B5]",
    
    r"bg-indigo-500": "bg-[#5C6BC0]",
    r"text-indigo-500": "text-[#5C6BC0]",
    r"border-indigo-500": "border-[#5C6BC0]",
    
    r"bg-indigo-200": "bg-[#C5CAE9]",
    r"text-indigo-200": "text-[#C5CAE9]",
    r"border-indigo-200": "border-[#C5CAE9]",
    
    r"bg-indigo-100": "bg-[#E8EAF6]",
    r"text-indigo-100": "text-[#3F51B5]", # Usually used for light background badges
    
    # Secondary Colors (Cyan: #00BCD4)
    # Replace blue and cyan classes with the exact cyan equivalent or variants
    r"bg-blue-600": "bg-[#00BCD4]",
    r"hover:bg-blue-700": "hover:bg-[#00ACC1]",
    r"text-blue-600": "text-[#00BCD4]",
    r"bg-cyan-600": "bg-[#00BCD4]",
    r"hover:bg-cyan-700": "hover:bg-[#00ACC1]",
    r"text-cyan-600": "text-[#00BCD4]",
}

def update_html_files():
    count = 0
    for file in os.listdir(ASSETS_DIR):
        if file.endswith(".html"):
            file_path = os.path.join(ASSETS_DIR, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in replacements.items():
                new_content = re.sub(pattern, replacement, new_content)
                
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated {file}")
                count += 1
    
    print(f"Total updated files: {count}")

if __name__ == "__main__":
    update_html_files()
