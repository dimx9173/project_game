import os
import re

ASSETS_DIR = "/Users/carlos/Library/CloudStorage/GoogleDrive-dimx9173@gmail.com/My Drive/老公與老婆分享/專案/遊戲平台管理/md/v8/assets"

replacements = {
    # 1. Global & Sidebar Backgrounds
    r"bg-\[#F4F7F6\]": "bg-slate-50",
    # Sidebar deep gradient instead of flat indigo
    r"bg-\[#283593\] text-white flex flex-col": "bg-gradient-to-b from-slate-900 to-indigo-950 text-white flex flex-col border-r border-slate-800 shadow-2xl relative",
    # Sidebar active item
    r"bg-\[#303F9F\] text-white border-l-4 border-white font-medium": "bg-white/10 backdrop-blur-md text-white border-l-4 border-cyan-400 font-bold shadow-inner relative overflow-hidden",
    # Sidebar hover items
    r"text-\[#C5CAE9\] hover:bg-\[#303F9F\] hover:text-white transition-colors": "text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-300",
    
    # 2. Header Glassmorphism
    r"bg-white border-b border-gray-200 flex items-center justify-between px-8": "bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm flex items-center justify-between px-8",
    r"bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10": "bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm flex items-center justify-between px-6",
    
    # 3. Cards & Panels
    r"bg-white rounded-xl shadow-sm border border-gray-100": "bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
    r"bg-white p-6 rounded-xl shadow-sm border border-gray-100": "bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
    
    # 4. Buttons
    # Primary Buttons
    r"bg-\[#3F51B5\] text-white rounded-lg text-sm font-medium hover:bg-\[#3949AB\] shadow-sm": "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300",
    r"bg-\[#3F51B5\] text-white rounded-lg text-sm font-medium hover:bg-\[#3949AB\] flex items-center shadow-sm": "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center",
    r"bg-\[#3F51B5\] text-white rounded-lg text-sm font-medium hover:bg-\[#3949AB\]": "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300",
    
    # Secondary Buttons
    r"bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-\[#F4F7F6\]": "bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 shadow-sm",
    
    # 5. Tables & Lists
    # Table Header
    r"bg-\[#F4F7F6\] sticky top-0 z-10 border-b border-gray-200": "bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200",
    r"bg-\[#F4F7F6\]": "bg-slate-50",
    
    # Table Row Hover
    r"hover:bg-\[#F4F7F6\]": "hover:bg-indigo-50/50 transition-colors duration-200",
    
    # Specific Badges Upgrades
    r"bg-green-100 text-green-800": "bg-emerald-100/80 text-emerald-700 rounded-full",
    r"bg-red-100 text-red-800": "bg-rose-100/80 text-rose-700 rounded-full",
    
    # Typography colors
    r"text-gray-800": "text-slate-800",
    r"text-gray-900": "text-slate-900",
    r"text-gray-500": "text-slate-500",
    r"text-gray-600": "text-slate-600",
    r"text-gray-400": "text-slate-400",
    r"border-gray-100": "border-slate-100",
    r"border-gray-200": "border-slate-200",
    r"border-gray-300": "border-slate-300",
    r"text-\[#3F51B5\]": "text-indigo-600",
}

def upgrade_ui_files():
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
                print(f"Upgraded to Premium UI on {file}")
                count += 1
    
    print(f"Total upgraded files: {count}")

if __name__ == "__main__":
    upgrade_ui_files()
