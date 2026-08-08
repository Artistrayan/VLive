import re

with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

content = content.replace('    </>', '''      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={() => {
          setIsInterestsModalOpen(false);
          const stored = localStorage.getItem("vlive_profile_interests_mock");
          if (stored) {
            setUserInterests(stored);
            import('../../utils/safeStorage').then(m => m.safeStorage.setItem("vlive_profile_interests", stored));
          }
        }}
        userId={null}
        showToast={typeof showToast !== 'undefined' ? showToast : undefined}
      />
    </>''')

with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
    f.write(content)
