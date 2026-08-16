import re
with open('src/App.jsx', 'r') as f:
    text = f.read()

text = re.sub(r" \|\| 'Tehran'", "", text)
text = re.sub(r" \|\| 5", "", text)
text = re.sub(r"city: loc\('تهران', 'Tehran'\)", "city: ''", text)
text = re.sub(r"\{ name: 'Sara Maleki', avatar: '', city: 'Tehran', isVerified: true \}", "null", text)
text = re.sub(r"\{ name: 'Sahar Miller', avatar: '', city: 'Tehran', isVerified: true \}", "null", text)

with open('src/App.jsx', 'w') as f:
    f.write(text)
