import re
with open('src/App.jsx', 'r') as f:
    text = f.read()

text = re.sub(r"title=\{matchDeckProfiles\[(\d+)\]\?\.name \|\| '[^']+'\}", r"title={matchDeckProfiles[\1]?.name || ''}", text)

with open('src/App.jsx', 'w') as f:
    f.write(text)
