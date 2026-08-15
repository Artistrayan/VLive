import re
with open('src/components/Tabs/WalletTab.jsx', 'r') as f:
    lines = f.readlines()

def count_braces(text):
    text = re.sub(r'".*?"', '""', text)
    text = re.sub(r"'.*?'", "''", text)
    return text.count('{') - text.count('}')

def count_parens(text):
    text = re.sub(r'".*?"', '""', text)
    text = re.sub(r"'.*?'", "''", text)
    return text.count('(') - text.count(')')

b_sum = 0
p_sum = 0
for i, line in enumerate(lines):
    b_sum += count_braces(line)
    p_sum += count_parens(line)
    if p_sum < 0:
        print(f"Line {i+1}: Paren sum dropped below 0")
        break
print(f"Total Braces Diff: {b_sum}, Parens Diff: {p_sum}")
