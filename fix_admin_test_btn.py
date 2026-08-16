import re
with open('src/modals/AdminDashboardModal.jsx', 'r') as f:
    text = f.read()

pattern = r"                    <button\s+onClick=\{[^}]*?newT = \{.*?\}\)[^>]*?>.*?</button>"
text = re.sub(pattern, "", text, flags=re.DOTALL)

with open('src/modals/AdminDashboardModal.jsx', 'w') as f:
    f.write(text)
