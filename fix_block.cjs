const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/onClick=\{\(\) \=\> showToast\(window\.loc\(`رای شما به "\$\{opt\}" ثبت شد!`, `رای شما به "\$\{opt\}" ثبت شد!`\)\)\}\n\s*;\n\s*\}\}/g, "onClick={() => showToast(window.loc(`رای شما به \"${opt}\" ثبت شد!`, `رای شما به \"${opt}\" ثبت شد!`))}>\n                      {opt}\n                    </button>\n                  ))}");
fs.writeFileSync('src/App.jsx', code, 'utf8');
