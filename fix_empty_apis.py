import re

with open('src/services/api.js', 'r') as f:
    text = f.read()

for api in ['apiDiscover', 'apiGiftShop', 'apiVip', 'apiCalls', 'apiCreatorStudio', 'apiReferral']:
    text = re.sub(f"export const {api} = {{}};\n", "", text)

with open('src/services/api.js', 'w') as f:
    f.write(text)

with open('src/App.jsx', 'r') as f:
    text = f.read()

# Replace imports
text = re.sub(r'  apiDiscover, ', '  ', text)
text = re.sub(r'  apiSocial, apiWallet, apiGiftShop, apiVip, apiCalls, apiNotifications,', '  apiSocial, apiWallet, apiNotifications,', text)
text = re.sub(r'  apiCreatorStudio, apiReferral, apiAdmin', '  apiAdmin', text)

with open('src/App.jsx', 'w') as f:
    f.write(text)
