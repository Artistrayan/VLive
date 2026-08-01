import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all useState(() => safeStorage.getParsed('...', <default>)) with useState(<default>)
# Pattern: useState(() => {\s*return safeStorage.getParsed('...', <default>);\s*})
# And Pattern: useState(() => safeStorage.getParsed('...', <default>))
content = re.sub(r"useState\(\(\) => \{\s*return safeStorage\.getParsed\('[^']+', (.*?)\);\s*\}\);", r"useState(\1);", content, flags=re.DOTALL)
content = re.sub(r"useState\(\(\) => safeStorage\.getParsed\('[^']+', (.*?)\)\);", r"useState(\1);", content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("All safeStorage arrays removed.")
