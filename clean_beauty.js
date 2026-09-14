const fs = require('fs');
let content = fs.readFileSync('src/components/LiveStudioModal.jsx', 'utf8');

// 1. Remove import
content = content.replace(/import AiFaceEffectOverlay from '\.\/Overlays\/AiFaceEffectOverlay';\n?/, '');

// 2. Remove states 112 to 129
// Find "const [beautyFilter, setBeautyFilter]" to "const [beautySubTab, setBeautySubTab]"
const stateRegex = /  const \[beautyFilter[\s\S]*?const \[beautySubTab[\s\S]*?\];\n?/m;
content = content.replace(stateRegex, '');

// 3. Remove AiFaceEffectOverlay component usage
const overlayRegex = /            \{\/\* Real-time AI Face & AR Overlay \*\/\}[\s\S]*?\/>\n/m;
content = content.replace(overlayRegex, '');

// 4. Remove 'beauty' drawer tab logic in Top Bar menu
const effectsMenuRegex = /                    \{\/\* Effects & Filters \*\/\}[\s\S]*?\{\/\* Tools & Moderation \*\/}/m;
content = content.replace(effectsMenuRegex, '{/* Tools & Moderation */}');

// 5. Remove Beauty & AR Filters button on main UI
const beautyBtnRegex = /            \{\/\* Beauty & AR Filters \*\/\}[\s\S]*?<\/button>\n/m;
content = content.replace(beautyBtnRegex, '');

// 6. Remove the drawer header item for beauty
content = content.replace(/                  \{activeTabDrawer === 'beauty' && window.loc\('✨ زیبایی', '✨ Beauty'\)\}\n?/m, '');

// 7. Remove the whole BEAUTY & AR EFFECTS STUDIO DRAWER
// This one is large. Starts with {/* BEAUTY & AR EFFECTS STUDIO DRAWER */}
const beautyDrawerRegex = /              \{\/\* BEAUTY & AR EFFECTS STUDIO DRAWER \*\/\}[\s\S]*?                  \)\} \/\* End Lighting \*\/\}[\s\S]*?                <\/div>\n              \)\}\n/m;

// wait, the end of the beauty drawer is:
//                 </div>
//               )}
// 
// Let's use a simpler regex for the beauty drawer by finding the start and an exact end string.

fs.writeFileSync('src/components/LiveStudioModal.jsx', content);
