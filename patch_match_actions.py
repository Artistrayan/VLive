import re

with open('/app/applet/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "      setMatchAnimationEffect(null);\n      setSwipeDragPos({ x: 0, y: 0 });\n    }\n  };"

replacement = """      setMatchAnimationEffect(null);
      setSwipeDragPos({ x: 0, y: 0 });
    } else if (actionType === 'random') {
      const randomIndex = Math.floor(Math.random() * matchDeckProfiles.length);
      setMatchCardIndex(randomIndex);
      showToast(loc('🎲 کاربر تصادفی انتخاب شد!', '🎲 Random match discovered!'));
      setMatchAnimationEffect(null);
      setSwipeDragPos({ x: 0, y: 0 });
    }
  };"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('/app/applet/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched triggerMatchAction successfully!")
else:
    print("Target string not found!")
