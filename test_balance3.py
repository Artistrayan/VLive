with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

parts = text.split('{/* 12. FINANCIAL SECURITY */}')
test_text = parts[0] + "</div></div></div></div></div></div></>);}"
with open('test_comp3.jsx', 'w') as f:
    f.write(test_text)
