const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// I'll just add Search to the beginning of the lucide-react import
if (!content.includes(' Search,')) {
    content = content.replace('AlertTriangle,', 'Search, AlertTriangle,');
    fs.writeFileSync('src/App.jsx', content);
    console.log('Added Search to imports');
} else {
    console.log('Search already imported');
}
