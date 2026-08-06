const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
// Fix missing opening tag
code = code.replace(/className=\{\`px-2\.5 py-1 rounded-xl text-\[10px\] font-black shadow transition ml-1 \$\{\n/g, "<button\n                    onClick={() => {\n                      const next = !isStreamerFollowed;\n                      setIsStreamerFollowed(next);\n                      showToast(next ? window.loc(`با موفقیت ${viewingStream.host} دنبال شد 👤`, `با موفقیت ${viewingStream.host} دنبال شد 👤`) : window.loc(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`));\n                    }}\n                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow transition ml-1 ${\n");
fs.writeFileSync('src/App.jsx', code, 'utf8');
