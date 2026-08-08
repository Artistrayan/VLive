import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's count standard open and close tags for custom elements and divs
tags_to_check = ['div', 'VisualSectionWrapper', 'button', 'span', 'section']

for t in tags_to_check:
    open_count = len(re.findall(rf'<{t}[\s/>]', content))
    # exclude self closing <t ... />
    self_closing = len(re.findall(rf'<{t}[^>]*/>', content))
    close_count = len(re.findall(rf'</{t}\s*>', content))
    actual_open = open_count - self_closing
    print(f"{t}: actual_open={actual_open}, close={close_count}, diff={actual_open - close_count}")

