with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

import re

# test part 1
parts = text.split('{/* SUB-TAB 7:')
test_text = parts[0] + "</div></div></div></div></div></div></>);}"
with open('test_comp.jsx', 'w') as f:
    f.write(test_text)
