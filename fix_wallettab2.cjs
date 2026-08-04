const fs = require('fs');

let content = fs.readFileSync('src/components/Tabs/WalletTab.jsx', 'utf8');

// Replace lucide icons
content = content.replace(
  "  TrendingUp, BarChart2, Video, MessageSquare, Star, Clock, AlertTriangle, Filter, Search, Plus, Radio, PhoneCall, Flame, Palette",
  "  TrendingUp, BarChart2, Video, MessageSquare, Star, Clock, AlertTriangle, Filter, Search, Plus, Radio, PhoneCall, Flame, Palette, BarChart3, Coins, Zap, Target"
);

const additionalVars = `
  const [txHistoryList, setTxHistoryList] = React.useState([
    { id: 1, type: 'in', title: 'خرید کوین', amount: '+5,000 Coins', date: 'امروز', status: 'موفق' },
    { id: 2, type: 'out', title: 'هدیه به استریمر', amount: '-1,200 Coins', date: 'دیروز', status: 'موفق' }
  ]);
  const [selectedCoinPackPayment, setSelectedCoinPackPayment] = React.useState('USDT');
  const handleBuyCoinsPack = props.handleBuyCoinsPack || ((pack) => showToast('خرید بسته کوین با موفقیت انجام شد'));
  const handleConvertDiamondsAction = props.handleConvertDiamondsAction || (() => showToast('تبدیل الماس انجام شد'));
  const [withdrawPinInput, setWithdrawPinInput] = React.useState('');
  const handleRequestWithdrawalAction = props.handleRequestWithdrawalAction || (() => showToast('درخواست برداشت ثبت شد'));
  const [txCategoryFilter, setTxCategoryFilter] = React.useState('all');
  const userAvatar = props.userAvatar || '';
  const userName = props.userName || 'کاربر';
  const setIsGoLiveOpen = props.setIsGoLiveOpen || (() => showToast('شروع پخش زنده'));
  const [creatorLiveTitle, setCreatorLiveTitle] = React.useState('');
  const [creatorLiveCategory, setCreatorLiveCategory] = React.useState('General');
  const [creatorLiveTags, setCreatorLiveTags] = React.useState('');
  const [creatorRecordStream, setCreatorRecordStream] = React.useState(true);
  const [creatorMicrophone] = React.useState(true);
  const [creatorCamera] = React.useState(true);
  const [creatorBeautyFilter, setCreatorBeautyFilter] = React.useState(true);
  const [creatorFollowersList, setCreatorFollowersList] = React.useState([]);
  const [creatorContentList, setCreatorContentList] = React.useState([]);
  const [creatorNewScheduleTitle, setCreatorNewScheduleTitle] = React.useState('');
  const [creatorNewScheduleTime, setCreatorNewScheduleTime] = React.useState('20:00');
  const [creatorNewScheduleDay] = React.useState('امروز');
  const [creatorScheduleList, setCreatorScheduleList] = React.useState([]);
  const [creatorBroadcastMsg, setCreatorBroadcastMsg] = React.useState('');
  const setPollQuestionInput = setCreatorPollQuestionInput;
`;

content = content.replace(
  "  const setIsVipCelebrationOpen = props.setIsVipCelebrationOpen || (() => showToast('VIP Celebration!'));",
  "  const setIsVipCelebrationOpen = props.setIsVipCelebrationOpen || (() => showToast('VIP Celebration!'));\n" + additionalVars
);

fs.writeFileSync('src/components/Tabs/WalletTab.jsx', content);
