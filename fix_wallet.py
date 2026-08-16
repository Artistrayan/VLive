import re
with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

# Fix the broken lines
text = re.sub(r"; ([a-zA-Z0-9_\.]+)\);", r"/* Removed mock transaction \1 */", text)

with open('src/components/Tabs/WalletTab.jsx', 'w') as f:
    f.write(text)
