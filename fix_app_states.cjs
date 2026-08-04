const fs = require('fs');
let appContent = fs.readFileSync('src/App.jsx', 'utf8');

const missingStates = `
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSmartMatchModalOpen, setIsSmartMatchModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isBecomeStreamerModalOpen, setIsBecomeStreamerModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
`;

// Insert after the first useState
appContent = appContent.replace(
  "const [authStep, setAuthStep] = useState('main');",
  "const [authStep, setAuthStep] = useState('main');" + missingStates
);

fs.writeFileSync('src/App.jsx', appContent);
