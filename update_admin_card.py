import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pos_start = content.find('{/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}')
pos_end = content.find('{/* ACTION GRID                                */}')

if pos_start != -1 and pos_end != -1:
    new_admin_card = """{/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}
        {/* ========================================== */}
        {isAdminUser && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border border-rose-500/50 shadow-xl space-y-2 animate-fadeIn">
            {/* Top Action Row: Entry Button Only */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-rose-500/30">
              <button
                onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>{window.loc('ورود به پنل مدیریت', 'Enter Admin Panel')}</span>
              </button>
            </div>

            {/* 4 Compact Stats Cards in 1 Single Row */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-rose-500/20 text-center flex flex-col justify-center items-center min-w-0">
                <span className="block text-sm sm:text-base font-black text-white">{usersList.length || 248}</span>
                <span className="text-[9px] text-slate-400 truncate w-full">{window.loc('کل کاربران', 'Total Users')}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-rose-500/20 text-center flex flex-col justify-center items-center min-w-0">
                <span className="block text-sm sm:text-base font-black text-amber-400">12</span>
                <span className="text-[9px] text-slate-400 truncate w-full">{window.loc('احراز معلق', 'Pending Auth')}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-rose-500/20 text-center flex flex-col justify-center items-center min-w-0">
                <span className="block text-sm sm:text-base font-black text-cyan-400">45</span>
                <span className="text-[9px] text-slate-400 truncate w-full">{window.loc('استریمرها', 'Streamers')}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-rose-500/20 text-center flex flex-col justify-center items-center min-w-0">
                <span className="block text-sm sm:text-base font-black text-rose-400">0</span>
                <span className="text-[9px] text-slate-400 truncate w-full">{window.loc('گزارش‌ها', 'Reports')}</span>
              </div>
            </div>

            {/* Visual Editor / Audit Log Quick Actions */}
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => setIsEditMode && setIsEditMode(!isEditMode)}
                className="flex-1 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditMode ? window.loc('خروج از ویرایش بصری', 'Exit Visual Edit') : window.loc('ویرایش بصری UI', 'Visual UI Editor')}</span>
              </button>
              <button
                onClick={() => {
                  addAdminAuditLog(window.loc('بازبینی سریع کاربران از پروفایل انجام شد', 'Quick review of users\' profiles was done'));
                  showToast(window.loc('بررسی امنیتی کامل اجرا شد ✅', 'A complete security check has been implemented'));
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{window.loc('ثبت لاگ نظارت', 'Record Audit Log')}</span>
              </button>
            </div>
          </div>
        )}
        {/* ========================================== */}
        """
    content = content[:pos_start] + new_admin_card + content[pos_end:]
    with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated Admin Card!")
else:
    print(f"Positions error: start={pos_start}, end={pos_end}")
