const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `                  ))}
                  <button
                    onClick={() => {
                      const next = !isStreamerFollowed;
                      setIsStreamerFollowed(next);
                      showToast(next ? window.loc(\`با موفقیت \${viewingStream.host} دنبال شد 👤\`, \`با موفقیت \${viewingStream.host} دنبال شد 👤\`) : window.loc(\`دنبال کردن لغو شد\`, \`دنبال کردن لغو شد\`));
                    }}
                    className={\`px-2.5 py-1 rounded-xl text-[10px] font-black shadow transition ml-1 \${
                    isStreamerFollowed 
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  }\`}
                >
                  {isStreamerFollowed ? loc('دنبال شده', 'Followed') : loc('+ دنبال کردن', '+ follow')}
                </button>
                </div>
              
`;

const replaceStr = `                  ))}
                </div>
              </div>
            )}
`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.jsx', code, 'utf8');
