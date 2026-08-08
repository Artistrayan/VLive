const fs = require('fs');
let file = fs.readFileSync('src/components/Tabs/ProfileTab.jsx', 'utf8');
file = file.replace('    </>', `      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={() => {
          setIsInterestsModalOpen(false);
          const stored = localStorage.getItem("vlive_profile_interests_mock");
          if (stored) {
            setUserInterests(stored);
            safeStorage.setItem("vlive_profile_interests", stored);
          }
        }}
        userId={null}
        showToast={showToast}
      />
    </>`);
fs.writeFileSync('src/components/Tabs/ProfileTab.jsx', file);
