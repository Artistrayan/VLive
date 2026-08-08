with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    lines = f.readlines()

lines.insert(364, '                </div>\n              </div>\n')

with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
    f.writelines(lines)
