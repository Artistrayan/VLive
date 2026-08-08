import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

stats_marker = "{/* SEPARATE STATS CARD UNDERNEATH PROFILE     */}"
stories_marker = "{/* STORIES HORIZONTAL BAR                    */}"
subnav_marker = "{/* SUB-NAVIGATION CONTENT TABS                */}"

stats_pos = content.find(stats_marker)
stories_pos = content.find(stories_marker)
subnav_pos = content.find(subnav_marker)

if stats_pos != -1 and stories_pos != -1 and subnav_pos != -1:
    stats_block = content[stats_pos:stories_pos]
    stories_block = content[stories_pos:subnav_pos]

    # Swap stories_block and stats_block
    new_combined = stories_block + stats_block
    
    content = content[:stats_pos] + new_combined + content[subnav_pos:]
    
    with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully moved stories card above stats card!")
else:
    print(f"Error finding positions: stats={stats_pos}, stories={stories_pos}, subnav={subnav_pos}")

