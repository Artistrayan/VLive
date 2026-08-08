import re

with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r'<div className="flex items-center justify-center sm:justify-start gap-2\.5 text-xs text-slate-400 flex-wrap">.*?(?=              </div>\n              \{\/\* Statistics Grid \*\/})',
    re.DOTALL
)

replacement = """<div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400 flex-wrap">
                  <span className="font-mono text-cyan-400 font-semibold">@{currentUsername || authUsername || 'rayan_vlive'}</span>
                </div>
"""

new_content, count = pattern.subn(replacement, content)
if count > 0:
    with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
        f.write(new_content)
    print("Replaced successfully.")
else:
    print("Pattern not found.")

