const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const regex = /\{activeStream && \!isMiniPlayer && \([\s\S]*?\n\s*\)\}/g;
const match = code.match(regex);
if (match) {
    console.log("Found activeStream block, length:", match[0].length);
    let str = match[0];
    let openCount = (str.match(/<div/g) || []).length;
    let closeCount = (str.match(/<\/div>/g) || []).length;
    console.log("div count:", openCount, closeCount);
    if (openCount > closeCount) {
        console.log("Missing", openCount - closeCount, "closing divs");
        str = str.replace(/\n\s*\)\}$/, '</div>'.repeat(openCount - closeCount) + '\n      )}');
        code = code.replace(match[0], str);
        fs.writeFileSync('src/App.jsx', code, 'utf8');
        console.log("Fixed!");
    } else if (closeCount > openCount) {
        console.log("Too many closing divs");
        str = str.replace(new RegExp('(</div>\\s*){' + (closeCount - openCount) + '}\\)}'), ')}');
        code = code.replace(match[0], str);
        fs.writeFileSync('src/App.jsx', code, 'utf8');
    }
}
