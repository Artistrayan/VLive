const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<button\n\s*onClick=\{\(\) \=\> \{\n\s*const next = \!isStreamerFollowed;\n\s*setIsStreamerFollowed\(next\);\n\s*showToast\(next \? window\.loc\(`با موفقیت \$\{viewingStream\.host\} دنبال شد 👤`, `با موفقیت \$\{viewingStream\.host\} دنبال شد 👤`\) : window\.loc\(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`\)\);\n\s*\}\}\n\s*className=\{\`px-2\.5 py-1 rounded-xl text-\[10px\] font-black shadow transition ml-1 \$\{\n\s*isStreamerFollowed\n\s*\? 'bg-slate-800 text-slate-300 border border-slate-700'\n\s*: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'\n\s*\}\`\}\n\s*>\n\s*\{isStreamerFollowed \? loc\('دنبال شده', 'Followed'\) : loc\('\+ دنبال کردن', '\+ follow'\)\}\n\s*<\/button>\n\s*<\/div>\n\s*<\/div>/g, 
`</div>
              </div>`);
fs.writeFileSync('src/App.jsx', code, 'utf8');
