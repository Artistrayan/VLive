import re

with open('src/components/Tabs/InterestsModal.jsx', 'r') as f:
    text = f.read()

# Replace fallbackInterests array with []
text = re.sub(
    r"    const fallbackInterests = \[.*?\];",
    r"    const fallbackInterests = [];",
    text, flags=re.DOTALL
)

with open('src/components/Tabs/InterestsModal.jsx', 'w') as f:
    f.write(text)
