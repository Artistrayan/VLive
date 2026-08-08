with open('src/components/Tabs/ProfileTab.jsx', 'r') as f:
    content = f.read()

replacement = """
                  {(() => {
                    try {
                      const parsed = JSON.parse(userInterests);
                      if (Array.isArray(parsed)) {
                        return parsed.map(id => {
                          const item = fullInterestsList.find(i => i.id === id);
                          if (!item) return null;
                          return (
                            <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </span>
                          );
                        });
                      }
                    } catch(e) {}
                    return userInterests.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold">
                        #{tag.trim()}
                      </span>
                    ));
                  })()}
"""

content = content.replace("""                  {userInterests.split(',').map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold">
                      #{tag.trim()}
                    </span>
                  ))}""", replacement.strip())

with open('src/components/Tabs/ProfileTab.jsx', 'w') as f:
    f.write(content)
