import React, { useState } from 'react';
import { 
  HelpCircle, Plus, Edit2, Trash2, Star, Check, X, Search, 
  CreditCard, Save, RefreshCw, Sparkles, Layers, Sliders
} from 'lucide-react';
import { helpCenterService, FAQ_CATEGORIES } from '../../services/helpCenterService';
import { loc } from '../../utils/i18n';

export default function AdminFaqManager({ showToast = () => {} }) {
  const [activeSubTab, setActiveSubTab] = useState('faqs'); // 'faqs' | 'deposit_methods'
  const [faqsList, setFaqsList] = useState(() => helpCenterService.getFaqs('all', ''));
  const [depositMethods, setDepositMethods] = useState(() => helpCenterService.getDepositMethods());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New/Edit FAQ Modal State
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqForm, setFaqForm] = useState({
    questionFa: '',
    questionEn: '',
    answerFa: '',
    answerEn: '',
    categoryId: 'account',
    popular: false
  });

  const refreshFaqs = () => {
    setFaqsList(helpCenterService.getFaqs(selectedCategory, searchQuery));
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!faqForm.questionFa.trim() || !faqForm.answerFa.trim()) {
      showToast(loc('لطفاً عنوان سوال و پاسخ فارسی را وارد کنید.', 'Please enter Persian question and answer.'));
      return;
    }

    if (editingFaqId) {
      helpCenterService.updateFaq(editingFaqId, faqForm);
      showToast(loc('✅ سوال متداول با موفقیت بروزرسانی شد.', '✅ FAQ updated successfully.'));
    } else {
      helpCenterService.addFaq(faqForm);
      showToast(loc('✅ سوال متداول جدید ایجاد و ذخیره شد.', '✅ New FAQ created successfully.'));
    }

    setIsFaqFormOpen(false);
    setEditingFaqId(null);
    setFaqForm({
      questionFa: '',
      questionEn: '',
      answerFa: '',
      answerEn: '',
      categoryId: 'account',
      popular: false
    });
    refreshFaqs();
  };

  const handleEditClick = (faq) => {
    setEditingFaqId(faq.id);
    setFaqForm({
      questionFa: faq.questionFa || '',
      questionEn: faq.questionEn || '',
      answerFa: faq.answerFa || '',
      answerEn: faq.answerEn || '',
      categoryId: faq.categoryId || 'account',
      popular: !!faq.popular
    });
    setIsFaqFormOpen(true);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm(loc('آیا از حذف این سوال متداول اطمینان دارید؟', 'Are you sure you want to delete this FAQ?'))) {
      helpCenterService.deleteFaq(id);
      showToast(loc('سوال متداول حذف گردید.', 'FAQ deleted.'));
      refreshFaqs();
    }
  };

  const handleTogglePopular = (id) => {
    helpCenterService.toggleFaqPopular(id);
    refreshFaqs();
    showToast(loc('وضعیت محبوبیت سوال تغییر کرد.', 'Popular status updated.'));
  };

  const handleToggleActive = (id) => {
    helpCenterService.toggleFaqActive(id);
    refreshFaqs();
    showToast(loc('وضعیت فعال/غیرفعال سوال تغییر کرد.', 'Active status updated.'));
  };

  // Deposit Method Update
  const handleUpdateDepositMethod = (id, fields) => {
    helpCenterService.updateDepositMethod(id, fields);
    setDepositMethods(helpCenterService.getDepositMethods());
    showToast(loc('✅ اطلاعات روش شارژ حساب بروزرسانی شد.', '✅ Deposit method config updated.'));
  };

  const filteredFaqs = faqsList.filter(f => {
    const matchCat = selectedCategory === 'all' || f.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      (f.questionFa && f.questionFa.toLowerCase().includes(q)) ||
      (f.answerFa && f.answerFa.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4 text-xs text-right animate-fadeIn" dir="rtl">
      
      {/* Subtab navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('faqs')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeSubTab === 'faqs' 
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{loc('مدیریت سوالات متداول (FAQ)', 'FAQ Management')}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deposit_methods')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              activeSubTab === 'deposit_methods' 
                ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{loc('تنظیمات روش‌های شارژ حساب', 'Deposit Methods Config')}</span>
          </button>
        </div>

        {activeSubTab === 'faqs' && (
          <button
            onClick={() => {
              setEditingFaqId(null);
              setFaqForm({
                questionFa: '',
                questionEn: '',
                answerFa: '',
                answerEn: '',
                categoryId: 'account',
                popular: false
              });
              setIsFaqFormOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>{loc('ایجاد سوال جدید', 'Add New FAQ')}</span>
          </button>
        )}
      </div>

      {/* ================= SUBTAB 1: FAQ MANAGEMENT ================= */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-4">
          
          {/* Search & Category filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={loc('جستجو در سوالات مدیریت...', 'Search FAQs...')}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pr-9 pl-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none shrink-0"
            >
              <option value="all">{loc('همه دسته‌بندی‌ها', 'All Categories')}</option>
              {FAQ_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.nameFa}</option>
              ))}
            </select>
          </div>

          {/* Add / Edit FAQ Modal Dialog */}
          {isFaqFormOpen && (
            <form onSubmit={handleSaveFaq} className="p-4 rounded-2xl bg-slate-950 border-2 border-purple-500/50 space-y-3 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-black text-sm text-purple-300">
                  {editingFaqId ? loc('ویرایش سوال متداول', 'Edit FAQ Item') : loc('ایجاد سوال متداول جدید', 'Create New FAQ')}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFaqFormOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('عنوان سوال (فارسی):', 'Question (Persian):')}</label>
                  <input
                    type="text"
                    required
                    value={faqForm.questionFa}
                    onChange={(e) => setFaqForm({ ...faqForm, questionFa: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('عنوان سوال (انگلیسی):', 'Question (English):')}</label>
                  <input
                    type="text"
                    value={faqForm.questionEn}
                    onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('پاسخ جامع (فارسی):', 'Answer (Persian):')}</label>
                <textarea
                  rows="3"
                  required
                  value={faqForm.answerFa}
                  onChange={(e) => setFaqForm({ ...faqForm, answerFa: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('دسته‌بندی:', 'Category:')}</label>
                    <select
                      value={faqForm.categoryId}
                      onChange={(e) => setFaqForm({ ...faqForm, categoryId: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    >
                      {FAQ_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.nameFa}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-4 text-xs font-bold text-amber-300">
                    <input
                      type="checkbox"
                      checked={faqForm.popular}
                      onChange={(e) => setFaqForm({ ...faqForm, popular: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-800"
                    />
                    <span>{loc('علامت‌گذاری به عنوان سوال پرتکرار (Popular)', 'Mark Popular')}</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFaqFormOpen(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {loc('انصراف', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loc('ذخیره سوال', 'Save FAQ')}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* FAQs List Table */}
          <div className="space-y-2">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{faq.questionFa}</h4>
                      {faq.popular && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          ⭐ Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{faq.answerFa}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePopular(faq.id)}
                      title={loc('تغییر محبوبیت', 'Toggle Popular')}
                      className={`p-1.5 rounded-lg border transition ${
                        faq.popular ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(faq.id)}
                      title={loc('فعال / غیرفعال', 'Toggle Active')}
                      className={`p-1.5 rounded-lg border transition ${
                        faq.active !== false ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleEditClick(faq)}
                      className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:text-white border border-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:text-white border border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: DEPOSIT METHODS CONFIG ================= */}
      {activeSubTab === 'deposit_methods' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
            💡 {loc('در این بخش ادمین می‌تواند تنظیمات دقیق روش‌های شارژ حساب، کارمزدها، حداقل/حداکثر سقف شارژ و توضیحات را ویرایش کند.', 'Manage payment methods configuration.')}
          </div>

          <div className="space-y-3">
            {depositMethods.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <h4 className="font-bold text-white">{m.nameFa}</h4>
                  </div>

                  <button
                    onClick={() => handleUpdateDepositMethod(m.id, { active: !m.active })}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                      m.active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {m.active ? loc('وضعیت: فعال', 'Active') : loc('وضعیت: غیرفعال', 'Inactive')}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('حداقل مبلغ شارژ:', 'Min Amount:')}</label>
                    <input
                      type="text"
                      defaultValue={m.minAmount}
                      onBlur={(e) => handleUpdateDepositMethod(m.id, { minAmount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('حداکثر مبلغ شارژ:', 'Max Amount:')}</label>
                    <input
                      type="text"
                      defaultValue={m.maxAmount}
                      onBlur={(e) => handleUpdateDepositMethod(m.id, { maxAmount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('کارمزد پردازش:', 'Fee:')}</label>
                    <input
                      type="text"
                      defaultValue={m.fee}
                      onBlur={(e) => handleUpdateDepositMethod(m.id, { fee: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-bold">{loc('زمان پردازش:', 'Processing Time:')}</label>
                    <input
                      type="text"
                      defaultValue={m.processingTime}
                      onBlur={(e) => handleUpdateDepositMethod(m.id, { processingTime: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
