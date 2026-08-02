import re

with open('/app/applet/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMatchFilterOpen(true)}"""

replacement = """              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerMatchAction('random')}
                  className="px-3 py-2 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 active:scale-95 transition flex items-center gap-1.5 shadow-md font-bold text-xs"
                  title="Random Match"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🎲 {loc('تصادفی', 'Random')}</span>
                </button>
                <button
                  onClick={() => setIsMatchFilterOpen(true)}"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('/app/applet/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added Random Match button to header!")
else:
    print("Target pattern for Match Header not found!")
