import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the snippet for followers, following, likes JSX from our previous script
from update_profile_layout import followers_following_likes_jsx

# Extract blocks
pos_nav_start = content.find('{/* SUB-NAVIGATION CONTENT TABS')
pos_admin_start = content.find('{/* DEDICATED ADMIN CARD FOR ADMIN USERS')
pos_grid_start = content.find('{/* ACTION GRID')
pos_panels_start = content.find('{/* 2. SUB-TAB CONTENT PANELS')
pos_panels_end = content.find('</div>\n      </div>\n    </div>\n  );\n}')

print(f"nav: {pos_nav_start}, admin: {pos_admin_start}, grid: {pos_grid_start}, panels: {pos_panels_start}, end: {pos_panels_end}")

nav_block = content[pos_nav_start:pos_admin_start]
admin_block = content[pos_admin_start:pos_grid_start]
grid_block = content[pos_grid_start:pos_panels_start]
panels_block = content[pos_panels_start:pos_panels_end]

# Add followers_following_likes_jsx at the beginning of panels_block right before TAB 1
panels_block_with_new_tabs = panels_block.replace(
    "{/* TAB 1: POSTS FEED */}",
    followers_following_likes_jsx.strip() + "\n\n        {/* TAB 1: POSTS FEED */}"
)

# New order: nav_block -> panels_block_with_new_tabs -> admin_block -> grid_block
new_flow = nav_block + panels_block_with_new_tabs + "\n\n        " + admin_block + "        " + grid_block

# Replace in content
before_nav = content[:pos_nav_start]
after_panels = content[pos_panels_end:]

new_content = before_nav + new_flow + after_panels

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("ProfileTab layout successfully reordered! Posts are now directly under Photo/Video icons!")
