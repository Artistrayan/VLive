import React from 'react';
import { X, Check, Globe, Image, Camera, Plus, BarChart2, Send, Trash2 } from 'lucide-react';

export default function ContentAndEngagementModals({
  isKycModalOpen,
  setIsKycModalOpen,
  kycNationalId,
  setKycNationalId,
  handleSubmitKyc,
  isSuggestionModalOpen,
  setIsSuggestionModalOpen,
  suggestionInput,
  setSuggestionInput,
  handleSendSuggestion,
  isLanguageModalOpen,
  setIsLanguageModalOpen,
  currentLang,
  setCurrentLang,
  APP_LANGUAGES,
  showToast,
  loc,
  isRtl,
  isAddPostModalOpen,
  setIsAddPostModalOpen,
  newPostCaption,
  setNewPostCaption,
  newPostImage,
  setNewPostImage,
  handlePublishPost,
  PRESET_AVATARS,
  compressImageFile,
  isAddStoryModalOpen,
  setIsAddStoryModalOpen,
  newStoryCaption,
  setNewStoryCaption,
  newStoryImage,
  setNewStoryImage,
  handlePublishStory,
  isCreatePollModalOpen,
  setIsCreatePollModalOpen,
  activeLivePoll,
  handleEndActivePoll,
  pollQuestionInput,
  setPollQuestionInput,
  pollOptionInputs,
  setPollOptionInputs,
  handleCreateAndBroadcastPoll
}) {
  return (
    <>
      {/* MODAL 9: KYC VERIFICATION REQUEST */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4">
            <h2 className="text-sm font-bold text-white">Verification & Cyan Badge Check</h2>
            <input 
              type="text" 
              value={kycNationalId}
              onChange={e => setKycNationalId(e.target.value)}
              placeholder="Enter ID / Document Serial Number..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button onClick={handleSubmitKyc} className="w-full py-3 rounded-2xl btn-neon-pink text-xs font-bold">
              Submit Request
            </button>
            <button onClick={() => setIsKycModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 10: SUBMIT APP FEATURE SUGGESTION */}
      {isSuggestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-cyan-500/50 bg-slate-900 rounded-3xl space-y-4">
            <h2 className="text-sm font-bold text-white">Submit App Feature Suggestion</h2>
            <textarea 
              value={suggestionInput}
              onChange={e => setSuggestionInput(e.target.value)}
              placeholder="Describe feature or bug..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white h-24"
            />
            <button onClick={handleSendSuggestion} className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold">
              Send Feedback
            </button>
            <button onClick={() => setIsSuggestionModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL 11: GLOBAL APP LANGUAGE SELECTOR */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border border-purple-500/50 bg-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Select Language
              </h2>
              <button onClick={() => setIsLanguageModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {APP_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setIsLanguageModalOpen(false);
                    showToast(`Language changed to ${lang.name}`);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    currentLang === lang.code
                      ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {currentLang === lang.code && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW POST TO PROFILE GALLERY */}
      {isAddPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-md card-3d p-6 border-2 border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Image className="w-5 h-5 text-pink-400" />
                {loc('انتشار تصویر جدید در گالری moments', 'Publish New Photo to Moments Gallery')}
              </h3>
              <button onClick={() => setIsAddPostModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {loc('انتخاب تصویر:', 'Select Photo:')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPostImage}
                    onChange={e => setNewPostImage(e.target.value)}
                    placeholder="URL تصویر یا انتخاب از لیست پایین..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                  <label className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs font-bold shrink-0 flex items-center gap-1">
                    <Camera className="w-4 h-4 text-pink-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const compressed = await compressImageFile(file);
                            setNewPostImage(compressed);
                            showToast('تصویر با موفقیت فشرده شد! 📸');
                          } catch (err) {
                            showToast('خطا در بارگذاری تصویر');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Preset"
                    onClick={() => setNewPostImage(avatar)}
                    className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition shrink-0 ${newPostImage === avatar ? 'border-pink-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
              {newPostImage && (
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-950">
                  <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {loc('کپشن و توضیحات:', 'Caption & Description:')}
                </label>
                <textarea
                  value={newPostCaption}
                  onChange={e => setNewPostCaption(e.target.value)}
                  placeholder={loc('کپشن جدید بنویسید...', 'Write a caption...')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 h-20"
                />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handlePublishPost}
                className="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg"
              >
                {loc('انتشار تصویر 🚀', 'Publish Moment 🚀')}
              </button>
              <button
                onClick={() => setIsAddPostModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PUBLISH NEW 24H STORY */}
      {isAddStoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-md card-3d p-6 border-2 border-purple-500/50 bg-slate-900 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                {loc('انتشار استوری جدید ۲۴ ساعته', 'Publish New 24h Story')}
              </h3>
              <button onClick={() => setIsAddStoryModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {loc('تصویر یا ویدیو استوری:', 'Story Media:')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newStoryImage}
                    onChange={e => setNewStoryImage(e.target.value)}
                    placeholder="URL تصویر استوری..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                  />
                  <label className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer text-xs font-bold shrink-0 flex items-center gap-1">
                    <Camera className="w-4 h-4 text-purple-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const compressed = await compressImageFile(file);
                            setNewStoryImage(compressed);
                            showToast('استوری آماده شد! 📸');
                          } catch (err) {
                            showToast('خطا در بارگذاری تصویر');
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar}
                    alt="Preset"
                    onClick={() => setNewStoryImage(avatar)}
                    className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition shrink-0 ${newStoryImage === avatar ? 'border-purple-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
              {newStoryImage && (
                <div className="relative rounded-2xl overflow-hidden aspect-[9/16] max-h-56 mx-auto border border-slate-800 bg-slate-950">
                  <img src={newStoryImage} alt="Story Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {loc('متن کوتاه استوری:', 'Story Caption:')}
                </label>
                <input
                  type="text"
                  value={newStoryCaption}
                  onChange={e => setNewStoryCaption(e.target.value)}
                  placeholder={loc('متن روی استوری...', 'Story text...')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handlePublishStory}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
              >
                {loc('انتشار استوری در پروفایل ⚡', 'Publish Story ⚡')}
              </button>
              <button
                onClick={() => setIsAddStoryModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HOST STUDIO - CREATE POLL MODAL */}
      {isCreatePollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-lg card-3d p-6 border-2 border-purple-500/50 bg-slate-900 rounded-3xl space-y-5 shadow-[0_0_50px_rgba(168,85,247,0.3)] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {loc('ایجاد نظرسنجی زنده - استودیو میزبان', 'Create Live Stream Poll - Host Studio')}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {loc('سوال و گزینه‌ها را تعریف کنید تا همزمان برای همه بینندگان لایو پخش شود', 'Define question and options to broadcast in real-time to all live viewers')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreatePollModalOpen(false)}
                className="p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Poll Live Summary if one exists */}
            {activeLivePoll && activeLivePoll.isActive && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {loc('نظرسنجی فعال در حال پخش است:', 'Active Poll Currently Live:')}
                  </span>
                  <button 
                    onClick={handleEndActivePoll}
                    className="px-2.5 py-1 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-black shadow transition"
                  >
                    {loc('پایان نظرسنجی ⏹️', 'End Poll ⏹️')}
                  </button>
                </div>
                <p className="text-xs font-bold text-white">{activeLivePoll.question}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-purple-200">
                  {activeLivePoll.options.map(opt => (
                    <div key={opt.id} className="p-2 rounded-xl bg-slate-900 border border-purple-500/30 flex justify-between items-center">
                      <span className="truncate">{opt.text}</span>
                      <span className="text-pink-400 font-mono">
                        {activeLivePoll.totalVotes > 0 ? Math.round((opt.votes / activeLivePoll.totalVotes) * 100) : 0}% ({opt.votes})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Poll Creation Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {loc('سوال نظرسنجی (Question):', 'Poll Question:')}
                </label>
                <input 
                  type="text"
                  value={pollQuestionInput}
                  onChange={e => setPollQuestionInput(e.target.value)}
                  placeholder={loc('مثلاً: چه آدرسی یا چه سبکی در لایو بعدی اجرا بشه؟', 'e.g. Which track or game should we play next?')}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    {loc('گزینه‌های پاسخ (حداکثر ۴ گزینه):', 'Response Options (Up to 4 options):')}
                  </label>
                  <span className="text-[10px] text-purple-300 font-mono">
                    {pollOptionInputs.filter(o => o.trim()).length} / 4 {loc('پر شده', 'filled')}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {pollOptionInputs.map((optVal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 text-[11px] font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <input 
                        type="text"
                        value={optVal}
                        onChange={e => {
                          const newOpts = [...pollOptionInputs];
                          newOpts[index] = e.target.value;
                          setPollOptionInputs(newOpts);
                        }}
                        placeholder={loc(`گزینه ${index + 1}${index < 2 ? ' (اجباری)' : ' (اختیاری)'}`, `Option ${index + 1}${index < 2 ? ' (Required)' : ' (Optional)'}`)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
                      />
                      {index >= 2 && (
                        <button 
                          onClick={() => {
                            const newOpts = [...pollOptionInputs];
                            newOpts[index] = '';
                            setPollOptionInputs(newOpts);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                          title={loc('پاک کردن', 'Clear')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <button 
                onClick={handleCreateAndBroadcastPoll}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loc('انتشار نظرسنجی زنده در لایو 📊🚀', 'Broadcast Poll to Live Stream 📊🚀')}
              </button>
              <button 
                onClick={() => setIsCreatePollModalOpen(false)}
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
