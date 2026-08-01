import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of using safeStorage for these arrays, we'll just initialize them empty.
content = re.sub(r"useState\(\(\) => \{\s*return safeStorage\.getParsed\('vlive_user_photos_v1', \[\]\);\s*\}\);", "useState([]);", content, flags=re.DOTALL)
content = re.sub(r"useState\(\(\) => \{\s*return safeStorage\.getParsed\('vlive_user_videos_v1', \[\]\);\s*\}\);", "useState([]);", content, flags=re.DOTALL)
content = re.sub(r"const \[adminUsersList, setAdminUsersList\] = useState\(\(\) => \{\s*return safeStorage\.getParsed\('vlive_admin_users_list'.*?\}\);", "const [adminUsersList, setAdminUsersList] = useState([]);", content, flags=re.DOTALL)
content = re.sub(r"const \[usersList, setUsersList\] = useState\(\(\) => \{\s*return safeStorage\.getParsed\('vlive_app_users_v8'.*?\}\);", "const [usersList, setUsersList] = useState([]);", content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("safeStorage arrays removed.")
