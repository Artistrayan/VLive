import re

with open('src/App.jsx', 'r') as f:
    text = f.read()

# matchDeckProfiles effect
text = re.sub(
    r"        const isTest = u\.user_type === 'TEST_USER'.*?isFake === true;\n        const isSelf = u\.username === currentUsername;\n        return !isTest && !isSelf && \(u\.status === 'approved' \|\| u\.isApproved !== false\);",
    r"        const isSelf = u.username === currentUsername;\n        return !isSelf && (u.status === 'approved' || u.isApproved !== false);",
    text, flags=re.DOTALL
)

# Other places
text = re.sub(
    r"u\.user_type !== 'TEST_USER' && u\.user_type !== 'DEMO_USER'",
    r"true",
    text
)
text = re.sub(
    r" && true",
    r"",
    text
)

with open('src/App.jsx', 'w') as f:
    f.write(text)
