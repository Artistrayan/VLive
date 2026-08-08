with open('src/modals/UserProfileViewModal.jsx', 'r') as f:
    content = f.read()

replacement = """            <p className="text-xs text-slate-300 leading-relaxed pt-1 dir-rtl">{bio}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Music', 'Live Stream', 'Fitness', 'Travel', 'Art'].map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300">
                  #{tag.trim()}
                </span>
              ))}
            </div>"""

content = content.replace('<p className="text-xs text-slate-300 leading-relaxed pt-1 dir-rtl">{bio}</p>', replacement)

with open('src/modals/UserProfileViewModal.jsx', 'w') as f:
    f.write(content)
