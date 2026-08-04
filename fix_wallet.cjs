const fs = require('fs');
let content = fs.readFileSync('src/components/Tabs/WalletTab.jsx', 'utf8');

const startIndex = content.indexOf('                    <label className="text-xs text-slate-200 block font-bold">مبلغ برداشت (USD):</label>');
const endIndex = content.indexOf('            {/* SUB-TAB 5: TRANSACTIONS HISTORY */}');

if (startIndex !== -1 && endIndex !== -1) {
  const goodSection = `                    <label className="text-xs text-slate-200 block font-bold">مبلغ برداشت (USD):</label>
                      <input
                        type="number"
                        value={withdrawAmountInput}
                        onChange={e => setWithdrawAmountInput(e.target.value)}
                        placeholder="مثلاً: 50"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">روش برداشت:</label>
                      <select
                        value={withdrawMethodInput}
                        onChange={e => setWithdrawMethodInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      >
                        <option value="USDT TRC20">USDT TRC20 (تتر شبکه‌ ترون)</option>
                        <option value="Wise / Wire">Bank Transfer / Wise</option>
                        <option value="Crypto Wallet">Crypto Web3 Wallet</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">آدرس کیف پول مقصد (Wallet Address):</label>
                    <input
                      type="text"
                      value={withdrawAddressInput}
                      onChange={e => setWithdrawAddressInput(e.target.value)}
                      placeholder="آدرس کیف پول تتر TRC20..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">رمز برداشت امنیتی (Security PIN):</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={withdrawPinInput}
                      onChange={e => setWithdrawPinInput(e.target.value)}
                      placeholder="رمز ۴ رقمی برداشت (پیش‌فرض: 1234)..."
                      className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-emerald-400 text-center tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleRequestWithdrawalAction}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition"
                  >
                    💸 ثبت درخواست برداشت فوری
                  </button>
                </div>

                {/* 6. WITHDRAWAL STATUSES TABLE */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    ۶. وضعیت درخواست‌های برداشت وجه (Withdrawal Requests Log)
                  </h4>

                  <div className="space-y-2">
                    {withdrawalsHistoryList.map(item => (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-xs">{item.amount}</span>
                            <span className="text-xs text-slate-200">({item.method})</span>
                          </div>
                          <span className="text-xs text-slate-200 block font-mono">آدرس: {item.address} • تاریخ: {item.date}</span>
                          {item.txHash && <span className="text-[10px] text-slate-400 block font-mono mt-0.5">تراکنش (TxHash): {item.txHash}</span>}
                          {item.reason && <p className="text-xs text-rose-300 mt-0.5">دلیل رد: {item.reason}</p>}
                        </div>
                        <span className={\`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto \${item.status === 'Completed' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold border border-emerald-500/30' : item.status === 'Pending' ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold border border-amber-500/30' : 'bg-rose-500/25 text-rose-200 border border-rose-400/40 font-bold border border-rose-500/30'}\`}>
                          {item.status === 'Completed' ? '🟢 Completed (تکمیل شده)' : item.status === 'Pending' ? '🟡 Pending (در حال بررسی)' : '🔴 Rejected (رد شده)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
`;

  content = content.substring(0, startIndex) + goodSection + content.substring(endIndex);
  fs.writeFileSync('src/components/Tabs/WalletTab.jsx', content);
  console.log('Fixed WalletTab.jsx');
} else {
  console.log('Could not find markers', startIndex, endIndex);
}
