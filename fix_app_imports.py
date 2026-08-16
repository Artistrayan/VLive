import re
with open('src/App.jsx', 'r') as f:
    text = f.read()

# Fix the import in App.jsx
text = re.sub(r'  apiProfile, apiHome, apiMessages, apiLive,', '  apiProfile, apiHome, apiMessages, apiLive,', text)
text = re.sub(r'  apiProfile, apiHome,   apiMessages, apiLive,', '  apiProfile, apiHome, apiMessages, apiLive,', text)
text = re.sub(r'apiDiscover', '', text)
text = re.sub(r'apiGiftShop', '', text)
text = re.sub(r'apiVip', '', text)
text = re.sub(r'apiCalls', '', text)
text = re.sub(r'apiCreatorStudio', '', text)
text = re.sub(r'apiReferral', '', text)

# cleanup double commas
text = re.sub(r',\s*,', ',', text)
text = re.sub(r'\{ ,', '{ ', text)
text = re.sub(r',\s*\}', ' }', text)

with open('src/App.jsx', 'w') as f:
    f.write(text)
