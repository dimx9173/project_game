#!/usr/bin/env python3
import os

os.chdir('/home/brian/project/game/md/v8/mockup/local')

files = os.listdir('.')

for f in files:
    if not f.endswith('.html'):
        continue
    if f.startswith('mockup_'):
        continue
    
    # 解析功能代碼
    if f.startswith('[C108]'):
        new = 'mockup_c108_machine_first_setup.html'
    elif f.startswith('[C11]'):
        new = 'mockup_c11_cash_operation.html'
    elif f.startswith('[C70]'):
        new = 'mockup_c70_local_login.html'
    elif f.startswith('[C87]') and '基本' in f:
        new = 'mockup_c87_basic_settings.html'
    elif f.startswith('[C87]') and '本機' in f:
        new = 'mockup_c87_local_settings.html'
    elif f.startswith('[L02]'):
        new = 'mockup_l02_machine_status.html'
    elif f.startswith('[L06]'):
        new = 'mockup_l06_machine_monitor.html'
    elif f.startswith('[L11]'):
        new = 'mockup_l11_game_list.html'
    elif f.startswith('[L34]'):
        new = 'mockup_l34_sync_status.html'
    else:
        continue
    
    os.rename(f, new)
    print(f'{f} -> {new}')

print('Done!')
