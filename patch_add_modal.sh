#!/bin/bash
sed -i '/    <\/ \>/d' src/components/Tabs/ProfileTab.jsx
# we can just replace `</>` with the modal and `</>`
sed -i 's/    <\/ \>/      <InterestsModal\n        isOpen={isInterestsModalOpen}\n        onClose={() => {\n          setIsInterestsModalOpen(false);\n          \/\/ Re-fetch interests to update UI after closing\n          const stored = localStorage.getItem("vlive_profile_interests_mock");\n          if (stored) {\n            setUserInterests(stored);\n            safeStorage.setItem("vlive_profile_interests", stored);\n          }\n        }}\n        userId={null} \/\/ null for local testing mode as per your current setup\n        showToast={showToast}\n      />\n    <\/>/g' src/components/Tabs/ProfileTab.jsx
