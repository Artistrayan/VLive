const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');

const startIndex = code.indexOf("{activeTab === 'match' && (");
const endIndex = code.indexOf("{/* 3. SUB-TAB 3: RECENT ACTIVITY LIKES */}");

if (startIndex !== -1 && endIndex !== -1) {
  const matchSection = code.substring(startIndex, endIndex);
  console.log("Match Section Length:", matchSection.length);
} else {
  console.log("Not found", startIndex, endIndex);
}
