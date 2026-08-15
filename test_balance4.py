with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    text = f.read()

parts = text.split('{/* 12. FINANCIAL SECURITY */}')
test_text = parts[0] + "</div>)}</>);}"
with open('test_comp4.jsx', 'w') as f:
    f.write(test_text)
