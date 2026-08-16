import re
with open('src/services/api.js', 'r') as f:
    text = f.read()

text = re.sub(
    r"    };\n  }\n  async getLiveStreams",
    r"    };\n  },\n  async getLiveStreams",
    text
)
with open('src/services/api.js', 'w') as f:
    f.write(text)
