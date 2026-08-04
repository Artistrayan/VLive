const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

const newPropsToAdd = `
        adminEditingUser={adminEditingUser}
        setAdminEditingUser={setAdminEditingUser}
        apiAdmin={apiAdmin}
        setStreamsList={setStreamsList}
        newAdminGiftName={newAdminGiftName}
        setNewAdminGiftName={setNewAdminGiftName}
        newAdminGiftCoins={newAdminGiftCoins}
        setNewAdminGiftCoins={setNewAdminGiftCoins}
        verificationsList={verificationsList}
        setVerificationsList={setVerificationsList}
        currentUsername={currentUsername}
        setIsVerified={setIsVerified}
`;

// Insert the new props into the component tag.
appContent = appContent.replace(
  '        handleRunAiReferralFraudCheck={handleRunAiReferralFraudCheck}',
  '        handleRunAiReferralFraudCheck={handleRunAiReferralFraudCheck}' + newPropsToAdd
);

fs.writeFileSync('src/App.jsx', appContent);
