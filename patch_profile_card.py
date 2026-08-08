with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

replacement = """
                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400 flex-wrap">
                  <span className="font-mono text-cyan-400 font-semibold">@{currentUsername || authUsername || 'rayan_vlive'}</span>
                </div>
"""

start_idx = content.find('<div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400 flex-wrap">')
end_idx = content.find('              </div>\n\n              {/* Statistics Grid */}')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + replacement.strip() + '\n' + content[end_idx:]
    with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
        f.write(new_content)
    print("Patched successfully")
else:
    print("Could not find start or end index")
