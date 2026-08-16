import re

with open('src/modals/AdminDashboardModal.jsx', 'r') as f:
    text = f.read()

# Modify the login check
new_text = re.sub(
    r"                    const isSuperAdminMatch = .*?;\n",
    r"",
    text
)
new_text = re.sub(
    r"                    if \(matchedAdmin \|\| isSuperAdminMatch\) \{",
    r"                    if (matchedAdmin) {",
    new_text
)
new_text = re.sub(
    r"                      setActiveAdminSession\(matchedAdmin \|\| \{.*?\}\);",
    r"                      setActiveAdminSession(matchedAdmin);",
    new_text
)

with open('src/modals/AdminDashboardModal.jsx', 'w') as f:
    f.write(new_text)
