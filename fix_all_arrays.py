import re
import glob

files = glob.glob('src/**/*.jsx', recursive=True) + glob.glob('src/**/*.js', recursive=True)

patterns_to_clear = [
    r"const \[blockedUsers, setBlockedUsers\] = useState\(\[.*?\]\);",
    r"const \[followedUsers, setFollowedUsers\] = useState\(\[.*?\]\);",
    r"const \[storyArchive, setStoryArchive\] = useState\(\[.*?\]\);",
    r"const \[claimedCheckInDays, setClaimedCheckInDays\] = useState\(\[.*?\]\);",
    r"const \[allMissions, setAllMissions\] = useState\(\[.*?\]\);",
    r"const \[claimedMissionsHistory, setClaimedMissionsHistory\] = useState\(\[.*?\]\);",
    r"const \[creatorPollOptions, setCreatorPollOptions\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[creatorScheduleList, setCreatorScheduleList\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[creatorFollowersList, setCreatorFollowersList\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[creatorContentList, setCreatorContentList\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[invitesList, setInvitesList\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[referralMilestones, setReferralMilestones\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[topInvitersLeaderboard, setTopInvitersLeaderboard\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[xpActivitiesList, setXpActivitiesList\] = useState\(\[.*?\]\);",
    r"const \[userBadgesList, setUserBadgesList\] = useState\(\[.*?\]\);",
    r"const \[userAchievementsList, setUserAchievementsList\] = useState\(\[.*?\]\);",
    r"const \[levelRoadmapList, setLevelRoadmapList\] = useState\(\[.*?\]\);",
    r"const \[txHistoryList, setTxHistoryList\] = useState\(\[.*?\]\);",
    r"const \[withdrawalsHistoryList, setWithdrawalsHistoryList\] = (React\.)?useState\(\[.*?\]\);",
    r"const \[streamPinnedMessages, setStreamPinnedMessages\] = useState\(\[.*?\]\);",
    r"const \[agenciesList, setAgenciesList\] = useState\(\[.*?\]\);",
    r"const \[authInterests, setAuthInterests\] = useState\(\[.*?\]\);",
    r"const \[servicesStatus, setServicesStatus\] = useState\(\[.*?\]\);",
    r"const \[chatMessages, setChatMessages\] = useState\(\[.*?\]\);",
    r"const \[scheduledStreams, setScheduledStreams\] = useState\(\[.*?\]\);",
    r"const \[liveHistory, setLiveHistory\] = useState\(\[.*?\]\);",
    r"const \[moderatorsList, setModeratorsList\] = useState\(\[.*?\]\);",
    r"const \[pollOptionInputs, setPollOptionInputs\] = (React\.)?useState\(\[.*?\]\);"
]

for filename in files:
    with open(filename, 'r') as f:
        text = f.read()
    
    modified = text
    for p in patterns_to_clear:
        # replace the matched array content with []
        var_name = re.search(r"const (\[.*?, .*?\]) =", p)
        if not var_name:
            continue
        var_name = var_name.group(1).replace('\\', '')
        
        # Determine if it uses React.useState or useState
        # the replacement will just use whatever the regex matches for the left side
        
        # We need a dynamic replacement logic. We can extract the left part dynamically.
        pass

    # Actually, simpler regex:
    for p in patterns_to_clear:
        # p is already a regex for the entire assignment
        # We can extract the var name and the React.useState / useState part
        def replacer(match):
            left_side = match.group(0).split("=")[0].strip()
            right_side = match.group(0).split("=")[1].strip()
            hook_name = "React.useState" if "React.useState" in right_side else "useState"
            return f"{left_side} = {hook_name}([]);"
        modified = re.sub(p, replacer, modified, flags=re.DOTALL)
        
    with open(filename, 'w') as f:
        f.write(modified)

