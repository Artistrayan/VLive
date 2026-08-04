const fs = require('fs');
let profile = fs.readFileSync('src/components/Tabs/ProfileTab.jsx', 'utf8');

// Add import if not exists
if (!profile.includes('useVisualUiEditor')) {
  profile = "import { useVisualUiEditor } from '../../context/VisualUiEditorContext';\n" + profile;
}

// Remove from props and get from hook
profile = profile.replace('isSuperAdmin, isEditMode, setIsEditMode, setIsAdminPanelOpen,', 'setIsAdminPanelOpen,');

// Find the component start
const componentStart = profile.indexOf('export default function ProfileTab(');
const returnIndex = profile.indexOf('return (', componentStart);

if (returnIndex !== -1) {
  const hookCode = "\n  const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();\n  ";
  profile = profile.substring(0, returnIndex) + hookCode + profile.substring(returnIndex);
  fs.writeFileSync('src/components/Tabs/ProfileTab.jsx', profile);
  console.log('Fixed ProfileTab hook');
}
