const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetReturn = `return (
    <div className={\`app-container text-slate-100 flex flex-col items-center justify-center min-h-screen relative overflow-hidden transition-colors duration-500 \${isDarkMode ? 'bg-slate-950' : 'bg-slate-900'} \${langCode === 'fa' || langCode === 'ar' ? 'dir-rtl' : 'dir-ltr'}\`}>
      {/* GLOWING BACKGROUND ORB */}`;
      
const replaceReturn = `return (
    <>
    <div className={\`app-container text-slate-100 flex flex-col items-center justify-center min-h-screen relative overflow-hidden transition-colors duration-500 \${isDarkMode ? 'bg-slate-950' : 'bg-slate-900'} \${langCode === 'fa' || langCode === 'ar' ? 'dir-rtl' : 'dir-ltr'}\`}>
      {/* GLOWING BACKGROUND ORB */}`;

if (code.includes(targetReturn)) {
    code = code.replace(targetReturn, replaceReturn);
    
    // now find the final closing tags
    const lastClosingDiv = code.lastIndexOf('</div>\n    </div>\n  );');
    if (lastClosingDiv !== -1) {
        code = code.substring(0, lastClosingDiv) + "</div>\n    </div>\n    </>\n  );" + code.substring(lastClosingDiv + 20);
    } else {
        console.log("Could not find closing div");
    }
    fs.writeFileSync('src/App.jsx', code, 'utf8');
    console.log("Success");
} else {
    console.log("Target return not found");
}
