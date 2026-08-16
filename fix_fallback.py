import re

with open('src/App.jsx', 'r') as f:
    text = f.read()

# Replace the DEFAULT_REAL_USERS map with just returning []
text = re.sub(
    r"    return DEFAULT_REAL_USERS\.map\(u => \(\{.*?\}\)\);",
    r"    return [];",
    text, flags=re.DOTALL
)

with open('src/App.jsx', 'w') as f:
    f.write(text)
