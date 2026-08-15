with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

parts = text.split('{walletSubTab === \'withdraw\' && (')
test_text = parts[0] + " </>);}"
with open('test_comp8.jsx', 'w') as f:
    f.write(test_text)
