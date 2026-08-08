import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add states for isCreatePostModalOpen and newPostType if not present
if 'isCreatePostModalOpen' not in content:
    content = content.replace(
        "const [newPostText, setNewPostText] = useState('');",
        "const [newPostText, setNewPostText] = useState('');\n  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);\n  const [newPostType, setNewPostType] = useState('photo');"
    )

# 2. Replace Sub-Navigation Content Tabs section
subnav_marker = "{/* SUB-NAVIGATION CONTENT TABS                */}"
admin_marker = "{/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}"

subnav_pos = content.find(subnav_marker)
admin_pos = content.find(admin_marker)

if subnav_pos != -1 and admin_pos != -1:
    old_subnav = content[subnav_pos:admin_pos]
    new_subnav = """{/* SUB-NAVIGATION CONTENT TABS                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav" defaultLabel="Profile Content Tabs">
          <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 mb-4 items-center justify-around gap-2">
            {/* Photos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeProfileTab === 'photos' 
                ? 'bg-slate-800 text-pink-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('photos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('عکس‌ها', 'Photos')}
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('photo');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 border border-pink-500/30 transition active:scale-95 flex items-center justify-center"
                title={window.loc('گذاشتن پست عکس جدید', 'Create Photo Post')}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Videos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeProfileTab === 'videos' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('videos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('فیلم‌ها', 'Videos')}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('video');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 transition active:scale-95 flex items-center justify-center"
                title={window.loc('گذاشتن پست ویدیو جدید', 'Create Video Post')}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </VisualSectionWrapper>

        """
    content = content[:subnav_pos] + new_subnav + content[admin_pos:]
    print("Subnav updated successfully.")

# 3. Remove Create Post Box from TAB 1: POSTS FEED
posts_marker = "{/* TAB 1: POSTS FEED */}"
posts_pos = content.find(posts_marker)

if posts_pos != -1:
    create_box_start = content.find('{/* Create Post Box */}', posts_pos)
    posts_list_start = content.find('{/* Posts List */}', posts_pos)
    if create_box_start != -1 and posts_list_start != -1:
        content = content[:create_box_start] + content[posts_list_start:]
        print("Create Post Box removed from feed successfully.")

# 4. Append Create Post Modal before the last closing return tags
# Find end of component return
return_end = content.rfind('</>')
if return_end == -1:
    return_end = content.rfind('</div>')

modal_code = """
      {/* CREATE POST MODAL */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {newPostType === 'video' ? (
                  <Video className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Image className="w-5 h-5 text-pink-400" />
                )}
                <h3 className="font-black text-white text-sm">
                  {newPostType === 'video' 
                    ? window.loc('ارسال ویدیوی جدید', 'New Video Post')
                    : window.loc('ارسال عکس یا پست جدید', 'New Photo Post')}
                </h3>
              </div>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Info Row */}
            <div className="flex items-center gap-3">
              <img
                src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
              />
              <div>
                <h4 className="font-bold text-white text-xs">{userName || authFullName || 'Rayan Maleki'}</h4>
                <span className="text-[10px] text-slate-400">@{currentUsername || authUsername || 'rayan_vlive'}</span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={window.loc('امروز چه خبر؟ متن خود را بنویسید...', 'Share a moment or thoughts...')}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500 resize-none dir-rtl"
            />

            {/* Image / Media Link */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                {newPostType === 'video' 
                  ? window.loc('لینک ویدیو یا تصویر (اختیاری)', 'Video/Cover link (optional)')
                  : window.loc('لینک تصویر پست (اختیاری)', 'Image link (optional)')}
              </label>
              <input
                type="text"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                placeholder="https://example.com/media.jpg"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-pink-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {window.loc('انصراف', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  handleAddPost();
                  setIsCreatePostModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{window.loc('انتشار پست', 'Publish')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
"""

if return_end != -1:
    content = content[:return_end] + modal_code + content[return_end:]
    print("Modal appended successfully.")

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

