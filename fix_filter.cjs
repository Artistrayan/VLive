const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(
  "    if (userFilter === 'online') return u.online;\n    if (userFilter === 'top') return u.isTop;\n    if (userFilter === 'verified') return u.isVerified;\n    return true;\n  });",
  "    if (userFilter === 'online') return u.online;\n    if (userFilter === 'followers') return u.isFollowed || u.following;\n    if (userFilter === 'top') return u.isTop;\n    if (userFilter === 'verified') return u.isVerified;\n    return true;\n  });"
);
fs.writeFileSync('src/App.jsx', content);
