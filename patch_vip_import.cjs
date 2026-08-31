const fs = require('fs');
const file = 'src/modals/VipAndRewardModals.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('apiSupport')) {
  content = content.replace("import { apiVip }", "import { apiVip, apiSupport }");
  if (!content.includes('apiSupport')) {
     content = content.replace("from '../services/api';", "from '../services/api';\nimport { apiSupport } from '../services/api';");
  }
}

fs.writeFileSync(file, content);
console.log('patched imports');
