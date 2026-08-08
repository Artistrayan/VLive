with open('src/components/Tabs/InterestsModal.jsx', 'r') as f:
    content = f.read()

content = content.replace('onClose();', 'onClose(selectedIds);')

with open('src/components/Tabs/InterestsModal.jsx', 'w') as f:
    f.write(content)


with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

content = content.replace('''        onClose={() => {
          setIsInterestsModalOpen(false);
          const stored = localStorage.getItem("vlive_profile_interests_mock");
          if (stored) {
            setUserInterests(stored);
            safeStorage.setItem("vlive_profile_interests", stored);
          }
        }}''', '''        onClose={(selectedIds) => {
          setIsInterestsModalOpen(false);
          if (selectedIds && Array.isArray(selectedIds)) {
            const stored = JSON.stringify(selectedIds);
            setUserInterests(stored);
            safeStorage.setItem("vlive_profile_interests", stored);
          } else {
            const stored = localStorage.getItem("vlive_profile_interests_mock");
            if (stored) {
              setUserInterests(stored);
              safeStorage.setItem("vlive_profile_interests", stored);
            }
          }
        }}''')

with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
    f.write(content)
