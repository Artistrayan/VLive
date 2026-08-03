import React from 'react';
import { 
  ShieldCheck, X, Eye, EyeOff, Send, Globe, Smartphone, LogOut
} from 'lucide-react';

export default function SecurityModal({
  isSecurityModalOpen,
  setIsSecurityModalOpen,
  securityTab,
  setSecurityTab,
  currentUsername,
  authUsername,
  changeUsernameInput,
  setChangeUsernameInput,
  setCurrentUsername,
  changeOldPassword,
  setChangeOldPassword,
  changeNewPassword,
  setChangeNewPassword,
  showChangeOldPassword,
  setShowChangeOldPassword,
  showChangeNewPassword,
  setShowChangeNewPassword,
  telegramConnected,
  setTelegramConnected,
  connectedTelegramUser,
  googleConnected,
  setGoogleConnected,
  connectedGoogleUser,
  activeDevices,
  setActiveDevices,
  setIsLoggedIn,
  setAuthStep,
  safeStorage,
  showToast
}) {
  if (!isSecurityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg card-3d p-6 border border-purple-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-pink-400" />
            <div>
              <h3 className="font-bold text-white text-base">Security & Account Center</h3>
              <p className="text-xs text-slate-400">Password, active sessions & OAuth connections</p>
            </div>
          </div>
          <button
            onClick={() => setIsSecurityModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SECURITY SUB-TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          {[
            { id: 'password', label: 'Password & Handle' },
            { id: 'accounts', label: 'Linked Accounts' },
            { id: 'devices', label: 'Active Devices' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSecurityTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                securityTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PASSWORD & USERNAME */}
        {securityTab === 'password' && (
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold">Username Handle (@)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={changeUsernameInput}
                  onChange={e => setChangeUsernameInput(e.target.value)}
                  placeholder={`Current: @${currentUsername || authUsername || 'user'}`}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                />
                <button
                  onClick={() => {
                    if (!changeUsernameInput.trim()) {
                      showToast('Please enter a new handle');
                      return;
                    }
                    const cleanU = changeUsernameInput.trim().replace(/^@/, '');
                    setCurrentUsername(cleanU);
                    setChangeUsernameInput('');
                    showToast(`Handle successfully updated to @${cleanU}`);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Update Handle
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <p className="font-bold text-white">Change Password</p>
              <div className="relative">
                <input
                  type={showChangeOldPassword ? "text" : "password"}
                  value={changeOldPassword}
                  onChange={e => setChangeOldPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowChangeOldPassword(!showChangeOldPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                  title={showChangeOldPassword ? "Hide" : "Show"}
                >
                  {showChangeOldPassword ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showChangeNewPassword ? "text" : "password"}
                  value={changeNewPassword}
                  onChange={e => setChangeNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowChangeNewPassword(!showChangeNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                  title={showChangeNewPassword ? "Hide" : "Show"}
                >
                  {showChangeNewPassword ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
              <button
                onClick={() => {
                  if (!changeOldPassword || !changeNewPassword) {
                    showToast('Please enter old and new passwords');
                    return;
                  }
                  setChangeOldPassword('');
                  setChangeNewPassword('');
                  showToast('Password successfully updated!');
                }}
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-md"
              >
                Save New Password
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LINKED OAUTH ACCOUNTS */}
        {securityTab === 'accounts' && (
          <div className="space-y-3 text-xs">
            {/* Telegram Connection */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-bold text-white">Telegram Account</p>
                  <span className="text-[10px] text-cyan-300 font-mono">{telegramConnected ? connectedTelegramUser : 'Not Connected'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setTelegramConnected(!telegramConnected);
                  showToast(telegramConnected ? 'Telegram account disconnected' : 'Telegram account linked!');
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${telegramConnected ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-cyan-600 text-white'}`}
              >
                {telegramConnected ? 'Disconnect' : 'Connect Telegram'}
              </button>
            </div>

            {/* Google Connection */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-rose-400" />
                <div>
                  <p className="font-bold text-white">Google Account</p>
                  <span className="text-[10px] text-rose-300 font-mono">{googleConnected ? connectedGoogleUser : 'Not Connected'}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setGoogleConnected(!googleConnected);
                  showToast(googleConnected ? 'Google account disconnected' : 'Google account linked!');
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${googleConnected ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-rose-600 text-white'}`}
              >
                {googleConnected ? 'Disconnect' : 'Connect Google'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE DEVICES */}
        {securityTab === 'devices' && (
          <div className="space-y-3 text-xs">
            {activeDevices.map(device => (
              <div key={device.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      {device.name}
                      {device.current && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded border border-emerald-500/30">Current</span>}
                    </p>
                    <span className="text-[10px] text-slate-400 block">{device.location} • {device.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setActiveDevices(prev => prev.filter(d => d.current));
                showToast('Logged out from all other active devices! 🔒');
              }}
              className="w-full py-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out From All Devices</span>
            </button>
          </div>
        )}

        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={() => {
              setIsSecurityModalOpen(false);
              setIsLoggedIn(false);
              setAuthStep('welcome');
              safeStorage.setItem('vlive_user_logged_in', 'false');
              showToast('Logged out of V.Live');
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
