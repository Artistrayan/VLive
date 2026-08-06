const fs = require('fs');
const babel = require('@babel/parser');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const s1 = "        </div>\n      )}";
const s2 = "      {isExitLiveModalOpen && (";
const startIdx = code.indexOf(s1, 7200);
const endIdx = code.indexOf(s2);
let newCode = code.substring(0, startIdx) + "        </div>\n        </div>\n      )}\n\n" + code.substring(endIdx);
fs.writeFileSync('test_newCode.jsx', newCode);
try {
  babel.parse(newCode, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
  console.log(e.message);
  let lines = newCode.split('\n');
  console.log(lines.slice(5310, 5320).join('\n'));
}
