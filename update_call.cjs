const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add dialpadInput state
if (!content.includes('dialpadInput')) {
  content = content.replace(
    "const [callMainSubTab, setCallMainSubTab] = useState('recent');",
    "const [callMainSubTab, setCallMainSubTab] = useState('recent');\n  const [dialpadInput, setDialpadInput] = useState('');"
  );
}

// 2. Add Dialpad subtab button
const tariffBtn = `<span>تعرفه و تنظیمات پولی</span>
              </button>`;

const dialpadBtn = `<span>تعرفه و تنظیمات پولی</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('dialpad')}
                className={\`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap \${callMainSubTab === 'dialpad' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}\`}
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>شماره‌گیر (Dialpad)</span>
              </button>`;

if (!content.includes("onClick={() => setCallMainSubTab('dialpad')}")) {
  content = content.replace(tariffBtn, dialpadBtn);
}

// 3. Add SUBTAB 6: DIALPAD UI
const subtab5Marker = "{/* SUBTAB 5: TARIFFS & CALL PRIVACY SETTINGS */}";
const subtab5EndIndex = content.indexOf("            )}", content.indexOf(subtab5Marker));

const dialpadUICode = `
            {/* SUBTAB 6: INTERACTIVE DIALPAD */}
            {callMainSubTab === 'dialpad' && (
              <div className="max-w-md mx-auto space-y-5 animate-fadeIn" dir="rtl">
                {/* Input Display Screen */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-purple-500/40 flex flex-col items-center justify-center space-y-2 relative overflow-hidden shadow-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">شماره‌گیر مستقیم P2P</span>
                  <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                    <input
                      type="text"
                      value={dialpadInput}
                      onChange={e => setDialpadInput(e.target.value)}
                      placeholder="شماره یا آیدی کاربر..."
                      className="bg-transparent text-lg font-black font-mono text-emerald-400 outline-none w-full text-center tracking-widest"
                    />
                    {dialpadInput && (
                      <button 
                        onClick={() => setDialpadInput(prev => prev.slice(0, -1))}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { num: '1', sub: '' },
                    { num: '2', sub: 'ABC' },
                    { num: '3', sub: 'DEF' },
                    { num: '4', sub: 'GHI' },
                    { num: '5', sub: 'JKL' },
                    { num: '6', sub: 'MNO' },
                    { num: '7', sub: 'PQRS' },
                    { num: '8', sub: 'TUV' },
                    { num: '9', sub: 'WXYZ' },
                    { num: '*', sub: '' },
                    { num: '0', sub: '+' },
                    { num: '#', sub: '' }
                  ].map(k => (
                    <button
                      key={k.num}
                      onClick={() => setDialpadInput(prev => prev + k.num)}
                      className="card-3d py-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-pink-500/50 hover:bg-slate-800 transition flex flex-col items-center justify-center shadow-md active:scale-95"
                    >
                      <span className="text-xl font-black text-white font-mono">{k.num}</span>
                      {k.sub && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{k.sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Call Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: \`User \${dialpadInput}\`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: false
                      };
                      handleInitiateCall(matchedUser, 'voice', '1on1');
                      showToast(\`برقراری تماس صوتی با \${matchedUser.name}...\`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>تماس صوتی</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: \`User \${dialpadInput}\`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: true
                      };
                      handleInitiateCall(matchedUser, 'video', '1on1');
                      showToast(\`برقراری تماس تصویری HD با \${matchedUser.name}...\`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl btn-neon-pink text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>تماس تصویری</span>
                  </button>
                </div>
              </div>
            )}
`;

if (subtab5EndIndex !== -1 && !content.includes("{/* SUBTAB 6: INTERACTIVE DIALPAD */}")) {
  const insertPos = subtab5EndIndex + "            )}".length;
  content = content.substring(0, insertPos) + dialpadUICode + content.substring(insertPos);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Call section updated successfully with Dialpad!');
