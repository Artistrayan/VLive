import sys
import re

with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

div_opens = len(re.findall(r'<div', text))
div_closes = len(re.findall(r'<\/div>', text))
print(f"Opens: {div_opens}, Closes: {div_closes}")
