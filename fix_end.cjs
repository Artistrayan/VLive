const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const searchStr = '              </div>\n            </div>\n          </div>\n        </div>\n      )}';
code = code.replace(searchStr, "              </div>\n            </div>\n          </div>\n        </div>\n      )}");
fs.writeFileSync('src/App.jsx', code, 'utf8');
