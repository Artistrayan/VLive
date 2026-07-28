import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. ADD VIP STATES
state_target = "const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);"
vip_states_code = """const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // REAL 3-TIER + ELITE VIP SYSTEM STATES
  const [vipPlan, setVipPlan] = useState(() => {
    return safeStorage.getItem('vlive_vip_plan') || 'gold'; // 'none' | 'silver' | 'gold' | 'diamond' | 'elite'
  });
  const [vipExpireDays, setVipExpireDays] = useState(() => {
    return parseInt(safeStorage.getItem('vlive_vip_expire_days') || '23', 10);
  });
  const [isVipMonthlyClaimed, setIsVipMonthlyClaimed] = useState(() => {
    return safeStorage.getItem('vlive_vip_monthly_claimed') === 'true';
  });
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [selectedVipPlan, setSelectedVipPlan] = useState('gold'); // 'silver' | 'gold' | 'diamond' | 'elite'
  const [selectedVipDuration, setSelectedVipDuration] = useState(1); // 1 | 3 | 6 | 12
  const [selectedVipPayMethod, setSelectedVipPayMethod] = useState('in_app'); // 'in_app' | 'usdt' | 'coins'
  const [isVipCelebrationOpen, setIsVipCelebrationOpen] = useState(false);
  const [vipEliteRequested, setVipEliteRequested] = useState(false);"""

if state_target in content:
    content = content.replace(state_target, vip_states_code)
    print("✅ VIP States added successfully!")
else:
    print("❌ Could not find state_target")

# 2. ADD CROWN BUTTON IN TOP HEADER (NEXT TO NOTIFICATION BELL)
header_bell_target = """{/* Notification Bell */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}"""

header_crown_code = """{/* VIP Premium Crown Button */}
          <button 
            onClick={() => setIsVipModalOpen(true)}
            className="p-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 border border-amber-500/50 text-amber-300 hover:text-white hover:border-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-1.5 group"
            title="VIP Premium Membership"
          >
            <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform fill-amber-400/30" />
            <span className="hidden md:inline text-xs font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">VIP</span>
          </button>

          {/* Notification Bell */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}"""

if header_bell_target in content:
    content = content.replace(header_bell_target, header_crown_code)
    print("✅ Header VIP Crown Button added!")
else:
    print("❌ Could not find header_bell_target")

# Save progress so far
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Part 1 complete.")
