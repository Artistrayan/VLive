const fs = require('fs');
const file = 'src/modals/VipAndRewardModals.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace payment method options to only show USDT
content = content.replace(
  /<div className="grid grid-cols-3 gap-2 text-xs">[\s\S]*?<\/div>\s*<button\s*onClick=\{async \(\) => \{/m,
  `<div className="flex flex-col space-y-4">
                      {/* Fixed USDT TRC20 Wallet Section */}
                      <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center justify-center space-y-3">
                        <span className="text-emerald-400 font-bold text-sm">Scan QR Code to Pay (USDT TRC20)</span>
                        <div className="p-2 bg-white rounded-xl">
                          <QRCode value="TJj6T4kC6bQpY9jA3fX9zP2kR4yH7mL5vN" size={120} />
                        </div>
                        <div className="text-center w-full">
                          <span className="text-[10px] text-slate-400 block mb-1">TRC20 Wallet Address:</span>
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-300 break-all select-all text-center">
                            TJj6T4kC6bQpY9jA3fX9zP2kR4yH7mL5vN
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 font-bold">Transaction Hash (TXID):</label>
                        <input
                          type="text"
                          id="vipTxHashInput"
                          placeholder="e.g. 5d41402abc4b2a76b9719d911017c592..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  <button
                    onClick={async () => {
                      const txInput = document.getElementById('vipTxHashInput')?.value?.trim();
                      if (!txInput || txInput.length < 10) {
                        showToast(window.loc('لطفاً کد پیگیری (TX Hash) معتبر وارد کنید', 'Please enter a valid TX Hash'));
                        return;
                      }`
);

// We need to import QRCode at the top
if (!content.includes('import QRCode')) {
  content = content.replace("import {", "import { QRCodeSVG as QRCode } from 'qrcode.react';\nimport {");
}

fs.writeFileSync(file, content);
console.log('patched');
