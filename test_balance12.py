with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

parts = text.split('{/* SUB-TAB 1: BALANCE OVERVIEW */}')
test_text = parts[0] + " </>);}"
with open('test_comp12.jsx', 'w') as f:
    f.write(test_text)
