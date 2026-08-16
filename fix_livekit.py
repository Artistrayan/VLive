import re

with open('src/services/api.js', 'r') as f:
    text = f.read()

# find generateLiveKitToken and replace its body
pattern = r'(async generateLiveKitToken\(\{.*?\}\) \{)(.*?)(?=\n  async getLiveStreams)'
replacement = r"""\1
    return {
      success: false,
      error: 'LiveKit token generation requires backend implementation',
      token: null
    };
  }"""
new_text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('src/services/api.js', 'w') as f:
    f.write(new_text)
