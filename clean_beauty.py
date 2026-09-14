import re

with open('src/components/LiveStudioModal.jsx', 'r') as f:
    content = f.read()

# 1. Remove import
content = re.sub(r"import AiFaceEffectOverlay from '\./Overlays/AiFaceEffectOverlay';\n?", '', content)

# 2. Remove states 
content = re.sub(r"  const \[beautyFilter[\s\S]*?const \[beautySubTab[\s\S]*?\];\n?", '', content)

# 3. Remove AiFaceEffectOverlay component usage
content = re.sub(r"            \{\/\* Real-time AI Face & AR Overlay \*\/\}[\s\S]*?\/>\n", '', content)

# 4. Remove 'beauty' drawer tab logic in Top Bar menu
content = re.sub(r"                    \{\/\* Effects & Filters \*\/\}[\s\S]*?\{\/\* Tools & Moderation \*\/}", '{/* Tools & Moderation */}', content)

# 5. Remove Beauty & AR Filters button on main UI
content = re.sub(r"            \{\/\* Beauty & AR Filters \*\/\}[\s\S]*?<\/button>\n", '', content)

# 6. Remove the drawer header item for beauty
content = re.sub(r"                  \{activeTabDrawer === 'beauty' && window\.loc\('✨ زیبایی', '✨ Beauty'\)\}\n?", '', content)

# 7. Remove the whole BEAUTY & AR EFFECTS STUDIO DRAWER
start_marker = "              {/* BEAUTY & AR EFFECTS STUDIO DRAWER */}"
end_marker = "                </div>\n              )}\n"
# Find start index
start_idx = content.find(start_marker)
if start_idx != -1:
    # Find the next matching end index after start_idx
    # We can use a heuristic. Look for the end of the drawer block.
    # We know the block ends right before the closing of `activeTabDrawer && (`
    # Actually, it's easier to find the exact end block. Let's find the position of the next END marker.
    # The BEAUTY drawer contains "END LIVE CONFIRMATION MODAL" after it.
    end_live_confirm = content.find("{/* END LIVE CONFIRMATION MODAL */}")
    
    # Let's find the closing of the activeTabDrawer block
    # It looks like:
    #                 </div>
    #               )}
    #             </div>
    #           )}
    #       </div>
    #   )}
    # {/* ========================================================================= */}
    # {/* END LIVE CONFIRMATION MODAL */}
    
    search_str = "              )}\n            </div>\n          )}\n        </div>\n      )}\n\n      {/* ========================================================================= */}\n      {/* END LIVE CONFIRMATION MODAL */}"
    end_idx = content.find(search_str)
    
    if end_idx != -1:
        content = content[:start_idx] + content[end_idx:]

with open('src/components/LiveStudioModal.jsx', 'w') as f:
    f.write(content)
