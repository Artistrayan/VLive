import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate all blocks precisely
stats_idx = content.find('VisualSectionWrapper pageId="profile" sectionId="profile_stats_card"')
nav_idx = content.find('VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav"')
posts_feed_idx = content.find('{/* TAB 1: POSTS FEED */}')
about_idx = content.find('{activeProfileTab === \'about\' && (')
edit_modal_idx = content.find('{isEditModalOpen && (')
interests_modal_idx = content.find('<InterestsModal')
create_modal_idx = content.find('{isCreatePostModalOpen && (')
admin_idx = content.find('{/* DEDICATED ADMIN CARD FOR ADMIN USERS')
grid_idx = content.find('{/* ACTION GRID')

header_part = content[:stats_idx]
stats_part = content[stats_idx:nav_idx]
nav_part = content[nav_idx:posts_feed_idx]

posts_feed_part = content[posts_feed_idx:about_idx]
other_tabs_part = content[about_idx:edit_modal_idx]

edit_modal_part = content[edit_modal_idx:interests_modal_idx]
interests_modal_part = content[interests_modal_idx:create_modal_idx]

# create_modal_part ends where admin_idx starts
create_modal_part = content[create_modal_idx:admin_idx]

# Clean create_modal_part from trailing tags like </>  );}
create_modal_part = re.sub(r'</>\s*\);?\s*\}', '', create_modal_part)

admin_part = content[admin_idx:grid_idx]

# grid_part is from grid_idx to where edit_modal_idx was or end of grid
grid_end = content.find('</VisualSectionWrapper>', grid_idx) + len('</VisualSectionWrapper>')
grid_part = content[grid_idx:grid_end]

# Verify followers, following, likes JSX
from update_profile_layout import followers_following_likes_jsx

# Build clean component body:
# 1. Header
# 2. Stats Bar
# 3. Content Tabs Nav (Photo & Video)
# 4. Posts Feed + Sub Tabs (Followers, Following, Likes, About, Activity, Lives, VIP, Wallet, Settings)
# 5. Admin Card (if admin)
# 6. Action Grid
# 7. Modals
# 8. Component Closing & Export

assembled = (
    header_part +
    stats_part +
    nav_part +
    "\n        {/* ========================================== */}\n" +
    "        {/* SUB-TAB CONTENT PANELS                  */}\n" +
    "        {/* ========================================== */}\n" +
    followers_following_likes_jsx.strip() + "\n\n" +
    posts_feed_part +
    other_tabs_part + "\n\n" +
    admin_part + "\n\n" +
    grid_part + "\n\n" +
    "        {/* ========================================== */}\n" +
    "        {/* MODALS                                    */}\n" +
    "        {/* ========================================== */}\n" +
    edit_modal_part + "\n" +
    interests_modal_part + "\n" +
    create_modal_part + "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  );\n" +
    "}\n\n" +
    "export default ProfileTab;\n"
)

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(assembled)

print("ProfileTab.jsx successfully rebuilt and assembled!")
