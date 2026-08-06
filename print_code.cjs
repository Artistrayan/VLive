const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
let partial = lines.slice(0, 346).join('\n') + '\n</>)}</>);}';
partial = partial.replace('{activeStoryView && (', '{activeStoryView && (<>');
fs.writeFileSync('test_code.jsx', partial);
