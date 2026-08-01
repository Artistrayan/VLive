import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

load_extra = """
    /* Additional API Loads for Production */
    if (apiAdmin && typeof apiAdmin.getPosts === 'function') {
      apiAdmin.getPosts().then(p => { if (p) setPosts(p); });
    }
"""

# Just a quick check to see where we can inject this safely.
# Actually I added `apiHome.getApprovedUsers` in `patch_profile2.py`.
for i, line in enumerate(lines):
    if "apiHome.getApprovedUsers().then(users => {" in line:
        lines.insert(i, load_extra)
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Posts load injected.")
