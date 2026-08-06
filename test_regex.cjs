const code = `
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75"
                    style={{
                      width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? \`\${activeStoryView.progress}%\` : '0%'
                    }}
                  />
`;
const regex = /<\/?div[^>]*(\/?)>/g;
let match = regex.exec(code);
console.log(match[0]);
console.log("Self closing?", match[0].endsWith('/>') || match[1] === '/');
