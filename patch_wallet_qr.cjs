const fs = require('fs');
const file = 'src/components/Tabs/WalletTab.jsx';
let content = fs.readFileSync(file, 'utf8');

const qrSection = `
                {/* Fixed USDT TRC20 Wallet Section for Deposits */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col items-center justify-center space-y-3 mb-4">
                  <span className="text-emerald-400 font-bold text-sm">Scan QR Code to Deposit (USDT TRC20)</span>
                  <div className="p-2 bg-white rounded-xl">
                    <QRCode value="TJj6T4kC6bQpY9jA3fX9zP2kR4yH7mL5vN" size={120} />
                  </div>
                  <div className="text-center w-full max-w-sm">
                    <span className="text-[10px] text-slate-400 block mb-1">TRC20 Wallet Address:</span>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-300 break-all select-all text-center">
                      TJj6T4kC6bQpY9jA3fX9zP2kR4yH7mL5vN
                    </div>
                  </div>
                </div>
`;

content = content.replace(
  "{/* COIN PACKAGES GRID */}",
  qrSection + "\n                {/* COIN PACKAGES GRID */}"
);

if (!content.includes('import { QRCodeSVG as QRCode }')) {
  content = content.replace("import React from", "import { QRCodeSVG as QRCode } from 'qrcode.react';\nimport React from");
}

fs.writeFileSync(file, content);
console.log('patched wallet qr');
