import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove items from INITIAL_CONVERSATIONS
content = re.sub(r'const INITIAL_CONVERSATIONS = \[.*?\];', 'const INITIAL_CONVERSATIONS = [];', content, flags=re.DOTALL)

# Find and clear matchDeckProfiles
content = re.sub(r'const \[matchDeckProfiles, setMatchDeckProfiles\] = useState\(\[.*?\]\);', 'const [matchDeckProfiles, setMatchDeckProfiles] = useState([]);', content, flags=re.DOTALL)

# Find and clear posts in safeStorage
content = re.sub(r"const \[posts, setPosts\] = useState\(\(\) => \{\s*return safeStorage.getParsed\('vlive_user_posts', \[.*?\]\);\s*\}\);", "const [posts, setPosts] = useState(() => safeStorage.getParsed('vlive_user_posts', []));", content, flags=re.DOTALL)

# Clear advancedStories
content = re.sub(r'const \[advancedStories, setAdvancedStories\] = useState\(\[.*?\]\);', 'const [advancedStories, setAdvancedStories] = useState([]);', content, flags=re.DOTALL)

# Clear streamsList
content = re.sub(r'const \[streamsList\] = useState\(\[.*?\]\);', 'const [streamsList] = useState([]);', content, flags=re.DOTALL)

# Clear partyRoomsList
content = re.sub(r'const \[partyRoomsList, setPartyRoomsList\] = useState\(\[.*?\]\);', 'const [partyRoomsList, setPartyRoomsList] = useState([]);', content, flags=re.DOTALL)

# Clear momentsFeed
content = re.sub(r'const \[momentsFeed, setMomentsFeed\] = useState\(\[.*?\]\);', 'const [momentsFeed, setMomentsFeed] = useState([]);', content, flags=re.DOTALL)

# Clear notificationsList
content = re.sub(r'const \[notificationsList, setNotificationsList\] = useState\(\[.*?\]\);', 'const [notificationsList, setNotificationsList] = useState([]);', content, flags=re.DOTALL)

# Clear aiReportList, aiReportedChatsList, etc.
content = re.sub(r'const \[aiReportList, setAiReportList\] = useState\(\[.*?\]\);', 'const [aiReportList, setAiReportList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[aiReportedChatsList, setAiReportedChatsList\] = useState\(\[.*?\]\);', 'const [aiReportedChatsList, setAiReportedChatsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[aiSupportTicketsList, setAiSupportTicketsList\] = useState\(\[.*?\]\);', 'const [aiSupportTicketsList, setAiSupportTicketsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[aiStreamerVerificationsList, setAiStreamerVerificationsList\] = useState\(\[.*?\]\);', 'const [aiStreamerVerificationsList, setAiStreamerVerificationsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[aiReferralFraudList, setAiReferralFraudList\] = useState\(\[.*?\]\);', 'const [aiReferralFraudList, setAiReferralFraudList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminLivesList, setAdminLivesList\] = useState\(\[.*?\]\);', 'const [adminLivesList, setAdminLivesList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminReportsList, setAdminReportsList\] = useState\(\[.*?\]\);', 'const [adminReportsList, setAdminReportsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminWithdrawalsList, setAdminWithdrawalsList\] = useState\(\[.*?\]\);', 'const [adminWithdrawalsList, setAdminWithdrawalsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminAdsList, setAdminAdsList\] = useState\(\[.*?\]\);', 'const [adminAdsList, setAdminAdsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminEventsList, setAdminEventsList\] = useState\(\[.*?\]\);', 'const [adminEventsList, setAdminEventsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminModerationQueue, setAdminModerationQueue\] = useState\(\[.*?\]\);', 'const [adminModerationQueue, setAdminModerationQueue] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminBackupsList, setAdminBackupsList\] = useState\(\[.*?\]\);', 'const [adminBackupsList, setAdminBackupsList] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[adminLogsList, setAdminLogsList\] = useState\(\[.*?\]\);', 'const [adminLogsList, setAdminLogsList] = useState([]);', content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Mock data arrays cleared in App.jsx")
