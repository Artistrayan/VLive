const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<button\n\s*key=\{oIdx\}\n\s*onClick=\{\(\) \=\> showToast\(window\.loc\(`رای شما به "\$\{opt\}" ثبت شد!`, `رای شما به "\$\{opt\}" ثبت شد!`\)\)\}\n\s*;\n\s*\}\}/g, `<button
                        key={oIdx}
                        onClick={() => showToast(window.loc(\`رای شما به "\${opt}" ثبت شد!\`, \`رای شما به "\${opt}" ثبت شد!\`))}
                        className="w-full py-2 bg-slate-950/60 rounded-xl border border-white/20 text-white font-bold backdrop-blur-md hover:bg-pink-500/80 transition"
                      >
                        {opt}
                      </button>
                    ))}`);
fs.writeFileSync('src/App.jsx', code, 'utf8');
