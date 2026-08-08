#!/bin/bash
# add imports
sed -i 's/import { CoinsIcon/import { interestService } from "..\/..\/services\/interestService";\nimport InterestsModal from ".\/InterestsModal";\nimport { CoinsIcon/' src/components/Tabs/ProfileTab.jsx

# add states
sed -i '/const \[isEditModalOpen/i \ \ const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);\n  const [fullInterestsList, setFullInterestsList] = useState([]);\n\n  useEffect(() => {\n    interestService.getGlobalInterests().then(res => setFullInterestsList(res));\n  }, []);\n' src/components/Tabs/ProfileTab.jsx

