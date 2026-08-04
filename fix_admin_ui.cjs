const fs = require('fs');

// 1. Edit VisualUiEditorToolbar.jsx
let toolbar = fs.readFileSync('src/components/VisualUiEditor/VisualUiEditorToolbar.jsx', 'utf8');
toolbar = toolbar.replace('if (!isSuperAdmin) return null;', 'if (!isSuperAdmin || !isEditMode) return null;');
fs.writeFileSync('src/components/VisualUiEditor/VisualUiEditorToolbar.jsx', toolbar);
console.log('Fixed VisualUiEditorToolbar.jsx');

// 2. Edit ProfileTab.jsx
let profile = fs.readFileSync('src/components/Tabs/ProfileTab.jsx', 'utf8');

// First we need to add isSuperAdmin, isEditMode, setIsEditMode, setIsAdminPanelOpen to props
profile = profile.replace('isVerified = true,', 'isVerified = true,\n    isSuperAdmin, isEditMode, setIsEditMode, setIsAdminPanelOpen,');

// Then add the section inside the Settings tab, or as a new tab?
// User said "انتقال بده داخل پروفایل"
// Let's put it at the top of the Profile overview, or inside a new section.
// A good place is below the "VIP Member Status" or inside the "Account Preferences" (Settings).
// Let's put it in Settings:

const adminSection = `
              {isSuperAdmin && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-bold text-rose-400 text-sm pb-2 border-b border-rose-500/30">Super Admin Zone (Rayan Only)</h3>
                  <button
                    onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                    className="w-full p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 flex items-center justify-between text-xs text-rose-300 transition shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span className="font-black">Open Super Admin Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-500" />
                  </button>
                  <button
                    onClick={() => setIsEditMode && setIsEditMode(!isEditMode)}
                    className="w-full p-4 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 flex items-center justify-between text-xs text-amber-300 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    <div className="flex items-center gap-3">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span className="font-black">{isEditMode ? 'Disable Visual Edit Mode' : 'Enable Visual Edit Mode'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              )}
`;

profile = profile.replace('Account Preferences</h3>', 'Account Preferences</h3>' + adminSection);
fs.writeFileSync('src/components/Tabs/ProfileTab.jsx', profile);
console.log('Fixed ProfileTab.jsx');

