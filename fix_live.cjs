const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

const liveModals = `
      {/* MODAL: LIVE HOST SETUP & BROADCAST */}
      {(isHostLiveOpen || isLiveModalOpen) && (
        <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex-1 w-full max-w-md mx-auto space-y-6 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Video className="w-6 h-6 text-pink-500" />
                Go Live
              </h2>
              <button 
                onClick={() => {
                  setIsHostLiveOpen(false);
                  setIsLiveModalOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold"
              >✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Broadcast Title</label>
                <input 
                  type="text"
                  placeholder="Enter a catchy title..."
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Category / Tags</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold cursor-pointer">Chatting</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold cursor-pointer">Music</span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold cursor-pointer">Gaming</span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
                <p className="font-bold mb-2">Camera Preview (Simulated)</p>
                <div className="w-full h-48 bg-slate-950 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-800 text-slate-500">
                  <Camera className="w-8 h-8 opacity-50" />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                showToast('Starting Broadcast...');
                setTimeout(() => {
                  setIsHostLiveOpen(false);
                  setIsLiveModalOpen(false);
                  setIsStreaming(true);
                  setViewingStream({
                    id: 'self',
                    host: currentUsername || userName,
                    title: 'My Live Stream',
                    isSelfStream: true,
                    thumbnail: userAvatar
                  });
                }, 1500);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-lg shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition"
            >
              Start Streaming
            </button>
          </div>
        </div>
      )}
`;

const insertIndex = app.indexOf('{/* MODAL FOR PARTY ROOM STAGE */}');
if (insertIndex !== -1) {
  app = app.substring(0, insertIndex) + liveModals + app.substring(insertIndex);
  fs.writeFileSync('src/App.jsx', app);
  console.log('Fixed Live modals');
} else {
  console.log('Marker not found');
}
