const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
  "setActiveChatCall({ type: 'voice', user: currentConv.user });",
  "handleInitiateCall(currentConv.user, 'voice', '1on1');"
);

content = content.replace(
  "setActiveChatCall({ type: 'video', user: currentConv.user });",
  "handleInitiateCall(currentConv.user, 'video', '1on1');"
);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('In-chat calls updated to handleInitiateCall');
