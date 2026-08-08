with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

if "getUserId" not in content:
    content = content.replace("import { safeStorage } from '../../utils/safeStorage';", "import { safeStorage } from '../../utils/safeStorage';\nimport { getUserId } from '../../services/api';")

content = content.replace('userId={null}', 'userId={getUserId()}')

with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
    f.write(content)
