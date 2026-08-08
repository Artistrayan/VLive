import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Outer main container space-y-6 -> space-y-1.5
content = content.replace(
    '<div className="space-y-6 pb-28 animate-fadeIn dir-ltr">',
    '<div className="space-y-1.5 pb-28 animate-fadeIn dir-ltr">'
)

# 2. Update Subnav tab container mb-4 -> mb-1.5 and larger icons, smaller plus buttons
subnav_marker = "{/* SUB-NAVIGATION CONTENT TABS                */}"
admin_marker = "{/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}"

subnav_pos = content.find(subnav_marker)
admin_pos = content.find(admin_marker)

if subnav_pos != -1 and admin_pos != -1:
    new_subnav = """{/* SUB-NAVIGATION CONTENT TABS                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav" defaultLabel="Profile Content Tabs">
          <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 mb-1.5 items-center justify-around gap-2">
            {/* Photos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all ${
              activeProfileTab === 'photos' 
                ? 'bg-slate-800 text-pink-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('photos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('عکس‌ها', 'Photos')}
              >
                <Image className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('photo');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-0.5 rounded-md bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 border border-pink-500/30 transition active:scale-95 flex items-center justify-center shrink-0"
                title={window.loc('گذاشتن پست عکس جدید', 'Create Photo Post')}
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Videos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all ${
              activeProfileTab === 'videos' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('videos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('فیلم‌ها', 'Videos')}
              >
                <Video className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('video');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 transition active:scale-95 flex items-center justify-center shrink-0"
                title={window.loc('گذاشتن پست ویدیو جدید', 'Create Video Post')}
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </VisualSectionWrapper>
        """
    content = content[:subnav_pos] + new_subnav + content[admin_pos:]

# 3. Reduce spacing inside feed posts space-y-4 -> space-y-1.5
content = content.replace(
    '{(activeProfileTab === \'photos\' || activeProfileTab === \'videos\') && (\n          <div className="space-y-4 animate-fadeIn">',
    '{(activeProfileTab === \'photos\' || activeProfileTab === \'videos\') && (\n          <div className="space-y-1.5 animate-fadeIn">'
)

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Spacing and icons updated successfully.")

