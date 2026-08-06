const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const returnStart = code.indexOf('return (', 5000);
const storyStart = code.indexOf('{activeStoryView && (');
const block = code.substring(returnStart, storyStart);

let frames = (block.match(/<DevicePreviewFrame/g) || []).length - (block.match(/<\/DevicePreviewFrame/g) || []).length;
let providers = (block.match(/<VisualUiEditorProvider/g) || []).length - (block.match(/<\/VisualUiEditorProvider/g) || []).length;

console.log("Frames open:", frames, "Providers open:", providers);
