import re
with open('src/App.jsx', 'r') as f:
    text = f.read()

text = re.sub(
    r"const \[dailyQuests, setDailyQuests\] = useState\(\[.*?\]\);",
    r"const [dailyQuests, setDailyQuests] = useState([]);",
    text, flags=re.DOTALL
)

with open('src/App.jsx', 'w') as f:
    f.write(text)
