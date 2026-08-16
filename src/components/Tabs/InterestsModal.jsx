import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Check, Save } from 'lucide-react';
import { interestService } from '../../services/interestService.js';

export default function InterestsModal({ isOpen, onClose, userId, showToast }) {
  const [globalInterests, setGlobalInterests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    // Fetch global and user interests
    const [allInterests, userInterests] = await Promise.all([
      interestService.getGlobalInterests(),
      userId ? interestService.getUserInterests(userId) : []
    ]);
    
    // Hardcoded fallback if DB is empty to prevent blank screen while setting up
    const fallbackInterests = [];

    setGlobalInterests(allInterests?.length > 0 ? allInterests : fallbackInterests);
    setSelectedIds(userInterests.map(i => i.id || i.interest_id) || []);
    setLoading(false);
  };

  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 15) {
        showToast && showToast('حداکثر ۱۵ مورد می‌توانید انتخاب کنید', 'Max 15 items allowed');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = async () => {
    if (selectedIds.length < 3) {
      showToast && showToast('حداقل ۳ مورد باید انتخاب شود', 'Min 3 items required');
      return;
    }
    
    setSaving(true);
    // If we have a real user ID and it's not a mock setup
    if (userId) {
      const success = await interestService.saveUserInterests(userId, selectedIds);
      if (success) {
        showToast && showToast('علاقه‌مندی‌ها با موفقیت ذخیره شد', 'Interests saved successfully');
        onClose(selectedIds);
      } else {
        showToast && showToast('خطا در ذخیره اطلاعات', 'Error saving data');
      }
    } else {
      // Local testing fallback
      // MOCK removed
      showToast && showToast('علاقه‌مندی‌ها با موفقیت ذخیره شد (Local)', 'Interests saved (Local)');
      onClose(selectedIds);
    }
    setSaving(false);
  };

  const filteredInterests = useMemo(() => {
    if (!searchQuery) return globalInterests;
    return globalInterests.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [globalInterests, searchQuery]);

  const categories = useMemo(() => {
    const cats = {};
    filteredInterests.forEach(i => {
      if (!cats[i.category]) cats[i.category] = [];
      cats[i.category].push(i);
    });
    return cats;
  }, [filteredInterests]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto" dir="rtl">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{window.loc('علاقه‌مندی‌ها', 'Interests')}</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {window.loc('حداقل ۳ و حداکثر ۱۵ مورد انتخاب کنید.', 'Select between 3 and 15 items.')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
          >✕</button>
        </div>

        {/* Counter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={window.loc('جستجو...', 'Search...')}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2 pr-9 pl-3 text-xs text-white outline-none focus:border-pink-500 transition"
            />
          </div>
          <div className="shrink-0 px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5">
            <span className={selectedIds.length < 3 || selectedIds.length > 15 ? 'text-rose-400' : 'text-emerald-400'}>
              {selectedIds.length}
            </span>
            <span className="text-slate-500">/ 15</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="py-10 text-center text-slate-500 text-xs">{window.loc('در حال بارگذاری...', 'Loading...')}</div>
          ) : Object.keys(categories).length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">{window.loc('نتیجه‌ای یافت نشد.', 'No results found.')}</div>
          ) : (
            Object.entries(categories).map(([cat, items]) => (
              <div key={cat} className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 mr-1">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 border
                          ${isSelected 
                            ? 'bg-pink-500/10 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)] scale-105' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all
              ${(selectedIds.length >= 3 && selectedIds.length <= 15)
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-[1.02] active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <span className="animate-pulse">{window.loc('در حال ذخیره...', 'Saving...')}</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{window.loc('ذخیره علاقه‌مندی‌ها', 'Save Interests')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
