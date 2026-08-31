const fs = require('fs');
const file = 'src/modals/VipAndRewardModals.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                      const basePrices = { silver: 300, gold: 500, diamond: 1000 };
                      const durationMonthsMap = { '1m': 1, '3m': 3, '6m': 6, '12m': 12 };
                      const durationNum = typeof selectedVipDuration === 'number' ? selectedVipDuration : (durationMonthsMap[selectedVipDuration] || 1);
                      const discountMultipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                      const planKey = (selectedVipPlan || 'gold').toLowerCase();
                      const monthlyCost = basePrices[planKey] || 500;
                      const totalBaseCoins = monthlyCost * durationNum;
                      const finalCoinsCost = Math.round(totalBaseCoins * (discountMultipliers[durationNum] || 1.0));
                      
                      if (selectedVipPayMethod === 'coins') {
                        if (userCoins < finalCoinsCost) {
                          showToast(window.loc(\`موجودی سکه کافی نیست! هزینه: \${finalCoinsCost} سکه\`, \`موجودی سکه کافی نیست! هزینه: \${finalCoinsCost} سکه\`));
                          return;
                        }
                      }

                      const res = await apiVip.purchasePlan({
                        plan: planKey,
                        durationMonths: durationNum,
                        priceCoins: finalCoinsCost
                      });

                      if (res && res.success !== false) {
                        if (selectedVipPayMethod === 'coins') {
                          setUserCoins(prev => Math.max(0, prev - finalCoinsCost));
                        }
                        setVipPlan(planKey);
                        setVipExpireDays(durationNum * 30);
                        setIsVipMonthlyClaimed(false);
                        setIsVipModalOpen(false);
                        setIsVipCelebrationOpen(true);
                      } else {
                        showToast(res?.error || 'Payment failed');
                      }`;

const replacementStr = `                      const planKey = (selectedVipPlan || 'gold').toLowerCase();
                      const durationNum = typeof selectedVipDuration === 'number' ? selectedVipDuration : 1;
                      
                      // Submit real ticket to DB
                      const res = await apiSupport.submitTicket(
                        'VIP Purchase Request (USDT)',
                        \`User requested \${planKey} VIP for \${durationNum} months.\\nTX Hash: \${txInput}\\nPayment Method: USDT TRC20\`
                      );
                      
                      if (res && res.success !== false) {
                        showToast(window.loc('درخواست شما ثبت شد. پس از تایید شبکه، حساب شما VIP خواهد شد.', 'Your request is submitted. Once confirmed on blockchain, VIP will be activated.'));
                        setIsVipModalOpen(false);
                      } else {
                        showToast(res?.error || 'Request failed');
                      }`;

if(content.includes('const basePrices = { silver: 300')) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content);
  console.log('patched');
} else {
  console.log('could not find target string');
}
