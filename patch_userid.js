const fs = require('fs');
let file = fs.readFileSync('src/components/Tabs/ProfileTab.jsx', 'utf8');

if (!file.includes("getUserId")) {
  file = file.replace("import { safeStorage } from '../../utils/safeStorage';", "import { safeStorage } from '../../utils/safeStorage';\nimport { getUserId } from '../../services/api';");
}

file = file.replace('userId={null}', 'userId={getUserId()}');

fs.writeFileSync('src/components/Tabs/ProfileTab.jsx', file);
