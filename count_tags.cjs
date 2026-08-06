const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const returnStart = code.indexOf('return (', 5000);
console.log("return start:", returnStart);

let substring = code.substring(returnStart, code.indexOf('{isExitLiveModalOpen'));
let openDivs = (substring.match(/<div/g) || []).length;
let closeDivs = (substring.match(/<\/div>/g) || []).length;
console.log("div count before isExitLiveModalOpen: open", openDivs, "close", closeDivs);

let openProviders = (substring.match(/<VisualUiEditorProvider/g) || []).length;
let closeProviders = (substring.match(/<\/VisualUiEditorProvider>/g) || []).length;
console.log("provider count:", openProviders, closeProviders);

let openFrames = (substring.match(/<DevicePreviewFrame/g) || []).length;
let closeFrames = (substring.match(/<\/DevicePreviewFrame>/g) || []).length;
console.log("frame count:", openFrames, closeFrames);
