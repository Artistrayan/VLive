const fs = require('fs');

let modalContent = fs.readFileSync('src/modals/AdminDashboardModal.jsx', 'utf8');

const additionalDestructuring = `
    adminEditingUser, setAdminEditingUser,
    apiAdmin,
    setStreamsList,
    newAdminGiftName, setNewAdminGiftName,
    newAdminGiftCoins, setNewAdminGiftCoins,
    verificationsList, setVerificationsList,
    currentUsername,
    setIsVerified,
`;

modalContent = modalContent.replace(
  '    handleRunAiReferralFraudCheck',
  '    handleRunAiReferralFraudCheck,' + additionalDestructuring
);

fs.writeFileSync('src/modals/AdminDashboardModal.jsx', modalContent);
