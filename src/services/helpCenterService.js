import { safeStorage } from '../utils/safeStorage';

const FAQ_STORAGE_KEY = 'vlive_faq_items_v1';
const DEPOSIT_METHODS_KEY = 'vlive_deposit_methods_v1';

export const FAQ_CATEGORIES = [
  { id: 'account', nameFa: 'حساب کاربری', nameEn: 'User Account', icon: '👤' },
  { id: 'auth', nameFa: 'ورود و ثبت‌نام', nameEn: 'Login & Register', icon: '🔑' },
  { id: 'profile', nameFa: 'پروفایل', nameEn: 'Profile', icon: '🖼️' },
  { id: 'match', nameFa: 'Match', nameEn: 'Match & Dating', icon: '💘' },
  { id: 'chat', nameFa: 'چت', nameEn: 'Chat & Messaging', icon: '💬' },
  { id: 'live', nameFa: 'لایو', nameEn: 'Live Streaming', icon: '🎥' },
  { id: 'video_call', nameFa: 'تماس تصویری', nameEn: 'Video Call', icon: '📹' },
  { id: 'vip', nameFa: 'VIP', nameEn: 'VIP Subscription', icon: '👑' },
  { id: 'adult_vip', nameFa: 'Adult VIP', nameEn: 'Adult VIP (18+)', icon: '🔞' },
  { id: 'coin', nameFa: 'Coin / سکه', nameEn: 'Coin & Currency', icon: '🪙' },
  { id: 'gift', nameFa: 'Gift / هدایا', nameEn: 'Gifts Catalog', icon: '🎁' },
  { id: 'diamond', nameFa: 'Diamond / الماس', nameEn: 'Diamonds Earnings', icon: '💎' },
  { id: 'deposit', nameFa: 'شارژ حساب', nameEn: 'Account Deposit', icon: '💳' },
  { id: 'withdrawal', nameFa: 'برداشت درآمد استریمر', nameEn: 'Streamer Payout', icon: '💸' },
  { id: 'security', nameFa: 'امنیت و حریم خصوصی', nameEn: 'Security & Privacy', icon: '🛡️' },
  { id: 'report', nameFa: 'گزارش تخلف', nameEn: 'Report Violation', icon: '🚨' },
  { id: 'rules', nameFa: 'قوانین استریمر', nameEn: 'Streamer Rules', icon: '📜' },
  { id: 'tech', nameFa: 'مشکلات فنی', nameEn: 'Technical Support', icon: '⚙️' },
  { id: 'refund', nameFa: 'پرداخت و بازگشت وجه', nameEn: 'Payments & Refunds', icon: '🔄' },
];

const DEFAULT_DEPOSIT_METHODS = [
  {
    id: 'crypto_usdt',
    nameFa: 'ارز دیجیتال تتر (USDT - TRC20 / BEP20)',
    nameEn: 'Crypto Tether (USDT TRC20/BEP20)',
    type: 'CRYPTO',
    icon: '💎',
    badge: 'بین‌المللی و خودکار',
    minAmount: '$1.00 USDT (100 Coins)',
    maxAmount: '$10,000 USDT',
    fee: 'کارمزد شبکه ترون / بایننس ($1 USDT)',
    processingTime: '۲ الی ۵ دقیقه (تأیید شبکه بلاک‌چین)',
    active: true,
    descriptionFa: 'شارژ حساب با تتر USDT از تمامی کیف‌پول‌ها (Trust Wallet, Binance, Nobitex,...).',
    descriptionEn: 'Top up with USDT from any crypto wallet worldwide.',
    instructionsFa: [
      'شبکه مورد نظر (TRC20 یا BEP20) را انتخاب کنید.',
      'آدرس کیف پول اختصاصی V.LIVE را کپی کنید.',
      'مبلغ تتر را واریز کرده و کد پیگیری Transaction Hash را ثبت کنید.',
      'پس از ۲ تاییدیه شبکه، سکه‌ها شارژ می‌شوند.'
    ],
    instructionsEn: [
      'Select network (TRC20 or BEP20).',
      'Copy the official V.LIVE deposit wallet address.',
      'Transfer USDT and paste the TX Hash.',
      'Coins credit automatically after 2 network confirmations.'
    ]
  }
];

const DEFAULT_FAQS = [
  // 1. ACCOUNT
  {
    id: 'faq_1',
    categoryId: 'account',
    questionFa: 'چگونه حساب کاربری خود را در V.LIVE ایجاد یا بازیابی کنم؟',
    questionEn: 'How do I create or recover my V.LIVE account?',
    answerFa: 'شما می‌توانید با استفاده از شماره موبایل، آدرس ایمیل یا ورود سریع گوگل حساب خود را بسازید. برای بازیابی رمز عبور، در صفحه ورود گزینه «فراموشی رمز عبور» را بزنید تا کد تایید برای شما ارسال شود.',
    answerEn: 'You can register using mobile number, email, or Google sign-in. To recover password, use "Forgot Password" on login screen to receive verification code.',
    popular: true,
    active: true
  },
  {
    id: 'faq_2',
    categoryId: 'account',
    questionFa: 'چگونه حساب کاربری خود را تایید یا احراز هویت (KYC) کنم؟',
    questionEn: 'How do I verify my account (KYC)?',
    answerFa: 'به بخش پروفایل -> «احراز هویت استریمر» بروید. کارت ملی یا پاسپورت خود را همراه با سلفی آپلود کنید. بررسی مدارک معمولاً بین ۳۰ دقیقه تا ۲ ساعت زمان می‌برد.',
    answerEn: 'Go to Profile -> Streamer Verification. Upload National ID / Passport and selfie. Verification takes 30 mins to 2 hours.',
    popular: false,
    active: true
  },

  // 2. AUTH
  {
    id: 'faq_3',
    categoryId: 'auth',
    questionFa: 'کد تایید پیامکی/ایمیلی دریافت نکرده‌ام، چه کنم؟',
    questionEn: 'I did not receive OTP code, what should I do?',
    answerFa: 'لطفاً پوشه Spam ایمیل خود را بررسی کنید یا مطمئن شوید پیامک‌های تبلیغاتی سیم‌کارت شما مسدود نباشد. همچنین می‌توانید از ورود جایگزین تلگرام یا گوگل استفاده کنید.',
    answerEn: 'Check Spam email folder and verify your carrier allows SMS. Alternatively, use Google or Telegram login.',
    popular: false,
    active: true
  },

  // 3. PROFILE
  {
    id: 'faq_4',
    categoryId: 'profile',
    questionFa: 'چگونه عکس پروفایل، بیوگرافی و اطلاعات شخصی را ویرایش کنم؟',
    questionEn: 'How do I edit profile picture and bio?',
    answerFa: 'در زبانه پروفایل روی آیکون «ویرایش پروفایل» کلیک کنید. تغییرات پس از بررسی سیستم ایمنی محتوا در کمتر از چند ثانیه ذخیره و اعمال می‌گردند.',
    answerEn: 'Tap "Edit Profile" in Profile tab. Updates are saved in seconds after content safety check.',
    popular: false,
    active: true
  },

  // 4. MATCH
  {
    id: 'faq_5',
    categoryId: 'match',
    questionFa: 'سیستم Match چگونه کار می‌کند و چگونه شانس مچ شدن را افزایش دهم؟',
    questionEn: 'How does Match system work and how to boost matches?',
    answerFa: 'سیستم هوشمند V.LIVE بر اساس علاقه‌مندی‌ها و موقعیت مکانی شما کاربران را پیشنهاد می‌دهد. با فعال‌سازی اشتراک VIP و بوست پروفایل، بازدید پروفایل شما ۱۰ برابر می‌شود.',
    answerEn: 'AI algorithm suggests profiles based on interests and location. Activate VIP & Profile Boost to gain 10x visibility.',
    popular: true,
    active: true
  },

  // 5. CHAT
  {
    id: 'faq_6',
    categoryId: 'chat',
    questionFa: 'آیا پیام‌ها و گفتگوهای خصوصی در V.LIVE امن هستند؟',
    questionEn: 'Are private messages secure in V.LIVE?',
    answerFa: 'بله، تمامی گفتگوهای متنی، صوتی و ویدئویی به‌صورت رمزنگاری‌شده متصل می‌شوند. ارسال محتوای غیراخلاقی یا هرزنامه توسط هوش مصنوعی بررسی و مسدود می‌شود.',
    answerEn: 'Yes, all text, voice, and video chats are end-to-end encrypted. AI Moderation blocks spam and inappropriate content.',
    popular: false,
    active: true
  },

  // 6. LIVE
  {
    id: 'faq_7',
    categoryId: 'live',
    questionFa: 'چگونه یک لایواستریم جدید شروع کنم و هدیه بگیرم؟',
    questionEn: 'How do I start a live stream and earn gifts?',
    answerFa: 'روی دکمه بنفش «شروع لایو» کلیک کنید. عنوان و کاور دلخواه را انتخاب نمایید. در حین لایو، بینندگان می‌توانند به شما هدایای سکه‌ای ارسال کنند که به الماس تبدیل می‌شود.',
    answerEn: 'Click purple "Start Live" button, set title and thumbnail. Viewers send coin gifts which turn into Diamonds for you.',
    popular: true,
    active: true
  },

  // 7. VIDEO CALL
  {
    id: 'faq_8',
    categoryId: 'video_call',
    questionFa: 'هزینه تماس تصویری چگونه محاسبه می‌شود؟',
    questionEn: 'How is video call pricing calculated?',
    answerFa: '۲۰ ثانیه اول تماس تصویری رایگان است. پس از آن مطابق نرخ مصوب پلتفرم (۳۰ سکه در دقیقه) از موجودی سکه تماس‌گیرنده کسر شده و ۷۰٪ آن به‌صورت الماس به استریمر تعلق می‌گیرد.',
    answerEn: 'First 20 seconds are FREE. Afterwards, 30 Coins/min is billed to caller and streamer earns 70% in Diamonds.',
    popular: true,
    active: true
  },

  // 8. VIP
  {
    id: 'faq_9',
    categoryId: 'vip',
    questionFa: 'مزایای اشتراک VIP چیست و چگونه آن را فعال کنم؟',
    questionEn: 'What are VIP subscription benefits and how to get it?',
    answerFa: 'اشتراک VIP شامل: نشان طلایی VIP، پیام مستقیم بدون محدودیت، دیدن لایک‌کنندگان پروفایل، تخفیف تماس تصویری و تخفیف خرید سکه است. از بخش پروفایل -> اشتراک VIP خریداری می‌شود.',
    answerEn: 'VIP includes Gold Badge, unlimited DMs, seeing who liked you, video call discounts, and coin bonus.',
    popular: true,
    active: true
  },

  // 9. ADULT VIP
  {
    id: 'faq_10',
    categoryId: 'adult_vip',
    questionFa: 'اشتراک Adult VIP (18+) چیست و چه فرقی با VIP معمولی دارد؟',
    questionEn: 'What is Adult VIP (18+) and how is it different?',
    answerFa: 'اشتراک Adult VIP مخصوص کاربران بالای ۱۸ سال است و دسترسی اختصاصی به لایوهای پرایوت، اتاق‌های ویژه و استریمرهای VIP بزرگسال را فراهم می‌سازد.',
    answerEn: 'Adult VIP is strictly for 18+ users, giving exclusive access to private 18+ streams and VIP rooms.',
    popular: false,
    active: true
  },

  // 10. COIN
  {
    id: 'faq_11',
    categoryId: 'coin',
    questionFa: 'سکه (Coin) چیست و چه کاربردهایی دارد؟',
    questionEn: 'What are Coins and what are they used for?',
    answerFa: 'سکه (Coin) ارز داخلی خرید پلتفرم است. شما می‌توانید با سکه هدیه ارسال کنید، تماس تصویری برمی‌دارید، استوری بوست کنید یا اشتراک VIP بخرید.',
    answerEn: 'Coins are the in-app purchase currency used to send gifts, initiate calls, boost content, and buy VIP.',
    popular: true,
    active: true
  },

  // 11. GIFT
  {
    id: 'faq_12',
    categoryId: 'gift',
    questionFa: 'چگونه هدیه ارسال کنم و انیمیشن هدایا چگونه نمایش داده می‌شود؟',
    questionEn: 'How do I send gifts and view gift animations?',
    answerFa: 'در لایو یا چت، روی آیکون 🎁 هدیه کلیک کرده و هدیه مورد نظر (از رز ۱۰ سکه‌ای تا قصر ۱۰,۰۰۰ سکه‌ای) را انتخاب کنید. انیمیشن سه بعدی آن فوراً روی استریم اجرا می‌شود.',
    answerEn: 'Click gift icon 🎁 in stream or chat, pick a gift (Rose 10c to Palace 10,000c). 3D animation plays live.',
    popular: false,
    active: true
  },

  // 12. DIAMOND
  {
    id: 'faq_13',
    categoryId: 'diamond',
    questionFa: 'الماس (Diamond) چیست و ارزش آن چقدر است؟',
    questionEn: 'What are Diamonds and how much are they worth?',
    answerFa: 'الماس درآمد واقعی استریمرهاست. با دریافت هر هدیه، ۷۰٪ ارزش سکه‌ای آن به‌صورت الماس در کیف پول استریمر ذخیره می‌شود. هر ۱۰۰ الماس برابر با $۰.۵۰ دلار نقد (یا معادل ریالی) است.',
    answerEn: 'Diamonds are streamer earnings. Streamers earn 70% of gift coin value in Diamonds. 100 Diamonds = $0.50 USD.',
    popular: true,
    active: true
  },

  // 13. DEPOSIT
  {
    id: 'faq_14',
    categoryId: 'deposit',
    questionFa: 'چگونه حساب خود را شارژ کنم و چه روش‌هایی وجود دارد؟',
    questionEn: 'How do I charge my account and what payment methods exist?',
    answerFa: 'شما می‌توانید از طریق ارز دیجیتال تتر (USDT TRC20/BEP20) حساب خود را شارژ کنید. سکه‌ها معمولاً بلافاصله شارژ می‌شوند.',
    answerEn: 'You can deposit via Crypto USDT (TRC20/BEP20). Credit is instant.',
    popular: true,
    active: true
  },
  {
    id: 'faq_15',
    categoryId: 'deposit',
    questionFa: 'در صورت ناموفق بودن پرداخت یا کسر وجه از حساب، چه کنم؟',
    questionEn: 'What if payment fails or money was deducted?',
    answerFa: 'در صورت کسر وجه و عدم شارژ سکه، تا ۷۲ ساعت مبلغ به‌صورت خودکار توسط بانک بازمی‌گردد. در صورت عدم بازگشت، شماره پیگیری را به پشتیبانی تلگرام ارسال کنید.',
    answerEn: 'If deducted without coins credited, bank auto-refunds in 72h. If not refunded, send transaction details to Telegram support.',
    popular: true,
    active: true
  },

  // 14. WITHDRAWAL
  {
    id: 'faq_16',
    categoryId: 'withdrawal',
    questionFa: 'حداقل مبلغ برداشت درآمد استریمر چقدر است و تسویه چقدر زمان می‌برد؟',
    questionEn: 'What is minimum withdrawal and processing time?',
    answerFa: 'حداقل برداشت ۱۰,۰۰۰ الماس ($۵۰ دلار USDT) است. پس از ثبت درخواست توسط استریمر، تیم مالی در کمتر از ۲ تا ۱۲ ساعت درخواست را بررسی و تتر به کیف پول واریز می‌کند.',
    answerEn: 'Min withdrawal is 10,000 Diamonds ($50 USDT). Payouts are reviewed and paid in 2 to 12 hours.',
    popular: true,
    active: true
  },
  {
    id: 'faq_17',
    categoryId: 'withdrawal',
    questionFa: 'چرا درخواست تسویه‌حساب من در حالت معلق (Pending) یا ردشده (Rejected) است؟',
    questionEn: 'Why is my withdrawal status Pending or Rejected?',
    answerFa: 'حالت Pending یعنی درخواست در صف بررسی سیستم ایمنی و حسابداری است. دلایل رد درخواست: عدم تطابق آدرس کیف پول، عدم تکمیل احراز هویت (KYC)، یا بررسی تخلفات اکانت است.',
    answerEn: 'Pending means awaiting audit queue. Rejections happen if wallet address is invalid, KYC incomplete, or fraud check failed.',
    popular: true,
    active: true
  },

  // 15. SECURITY
  {
    id: 'faq_18',
    categoryId: 'security',
    questionFa: 'چگونه امنیت حساب خود را افزایش دهم؟',
    questionEn: 'How do I increase my account security?',
    answerFa: 'تایید دو مرحله‌ای (2FA) را فعال کنید، رمز عبور قوی انتخاب کنید و هرگز اطلاعات ورود یا رمز کیف پول خود را در اختیار دیگران قرار ندهید. پشتیبانی رسمی هرگز رمز شما را نمی‌خواهد.',
    answerEn: 'Enable 2FA, use strong passwords, and never share credentials. Official support never asks for passwords.',
    popular: false,
    active: true
  },

  // 16. REPORT
  {
    id: 'faq_19',
    categoryId: 'report',
    questionFa: 'چگونه تخلف، مزاحمت یا محتوای نامناسب را گزارش کنم؟',
    questionEn: 'How do I report violations, harassment, or inappropriate content?',
    answerFa: 'در صفحه چت، پروفایل یا لایواستریم روی آیکون «گزارش تخلف 🚨» کلیک کنید. تیم مدیریت ۲۴/۷ کمتر از ۵ دقیقه گزارش را بررسی و اقدامات قانونی انجام می‌دهد.',
    answerEn: 'Click Report 🚨 icon on chat, profile, or live stream. Moderation team reviews reports within 5 minutes.',
    popular: false,
    active: true
  },

  // 17. RULES
  {
    id: 'faq_20',
    categoryId: 'rules',
    questionFa: 'قوانین اصلی استریم و فعالیت مالی در V.LIVE چیست؟',
    questionEn: 'What are key streaming and financial rules on V.LIVE?',
    answerFa: 'هرگونه تبانی برای تقلب، ساخت حساب جعلی، تبلیغ خدمات خارج پلتفرم، هتاکی و عدم رعایت موازین اخلاقی ممنوع است و منجر به مسدودی دائم و ضبط موجودی می‌شود.',
    answerEn: 'Fraud, fake accounts, off-platform promotion, and policy violations result in immediate permanent ban.',
    popular: false,
    active: true
  },

  // 18. TECH
  {
    id: 'faq_21',
    categoryId: 'tech',
    questionFa: 'در صورت قطعی لایو یا مشکل در صدا و تصویر چه باید کرد؟',
    questionEn: 'What to do during live stream lag or audio/video issues?',
    answerFa: 'اتصال اینترنت خود را بررسی کنید. پیشنهاد می‌شود از شبکه‌های 4G/5G یا Wi-Fi پرسرعت استفاده کنید. در صورت تداوم، حافظه کش برنامه را پاک کنید.',
    answerEn: 'Check 4G/5G/Wi-Fi connection. Clear app cache if lagging persists.',
    popular: false,
    active: true
  },

  // 19. REFUND
  {
    id: 'faq_22',
    categoryId: 'refund',
    questionFa: 'قوانین بازگشت وجه (Refund Policy) به چه صورت است؟',
    questionEn: 'What is the Refund Policy for purchases?',
    answerFa: 'به دلیل ماهیت مصرفی سکه و هدایا، سکه‌های مصرف‌شده قابل استرداد نیستند. اگر سکه خریداری‌شده اما مصرف نشده باشد و اشتباهی رخ داده باشد، پشتیبانی تا ۲۴ ساعت بررسی می‌کند.',
    answerEn: 'Spent coins & gifts are non-refundable. Unspent accidental purchases can be audited by support within 24 hours.',
    popular: true,
    active: true
  }
];

class HelpCenterService {
  constructor() {
    this.faqs = this.loadFaqs();
    this.depositMethods = this.loadDepositMethods();
  }

  loadFaqs() {
    try {
      const stored = safeStorage.getItem(FAQ_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load stored FAQs:', e);
    }
    return DEFAULT_FAQS;
  }

  saveFaqs() {
    try {
      safeStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(this.faqs));
    } catch (e) {
      console.warn('Failed to save FAQs:', e);
    }
  }

  loadDepositMethods() {
    try {
      const stored = safeStorage.getItem(DEPOSIT_METHODS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load stored deposit methods:', e);
    }
    return DEFAULT_DEPOSIT_METHODS;
  }

  saveDepositMethods() {
    try {
      safeStorage.setItem(DEPOSIT_METHODS_KEY, JSON.stringify(this.depositMethods));
    } catch (e) {
      console.warn('Failed to save deposit methods:', e);
    }
  }

  // Getters
  getCategories() {
    return FAQ_CATEGORIES;
  }

  getFaqs(categoryId = 'all', searchQuery = '') {
    let list = this.faqs.filter(f => f.active !== false);

    if (categoryId && categoryId !== 'all') {
      list = list.filter(f => f.categoryId === categoryId);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f => 
        (f.questionFa && f.questionFa.toLowerCase().includes(q)) ||
        (f.questionEn && f.questionEn.toLowerCase().includes(q)) ||
        (f.answerFa && f.answerFa.toLowerCase().includes(q)) ||
        (f.answerEn && f.answerEn.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getPopularFaqs() {
    return this.faqs.filter(f => f.active !== false && f.popular);
  }

  getDepositMethods() {
    return this.depositMethods.filter(m => m.active !== false);
  }

  // Admin CRUD for FAQs
  addFaq(faqItem) {
    const newFaq = {
      id: `faq_${Date.now()}`,
      active: true,
      popular: false,
      ...faqItem
    };
    this.faqs.unshift(newFaq);
    this.saveFaqs();
    return newFaq;
  }

  updateFaq(id, updatedFields) {
    this.faqs = this.faqs.map(f => f.id === id ? { ...f, ...updatedFields } : f);
    this.saveFaqs();
    return this.faqs.find(f => f.id === id);
  }

  deleteFaq(id) {
    this.faqs = this.faqs.filter(f => f.id !== id);
    this.saveFaqs();
  }

  toggleFaqPopular(id) {
    this.faqs = this.faqs.map(f => f.id === id ? { ...f, popular: !f.popular } : f);
    this.saveFaqs();
  }

  toggleFaqActive(id) {
    this.faqs = this.faqs.map(f => f.id === id ? { ...f, active: !f.active } : f);
    this.saveFaqs();
  }

  // Admin Deposit Method configuration
  updateDepositMethod(id, updatedFields) {
    this.depositMethods = this.depositMethods.map(m => m.id === id ? { ...m, ...updatedFields } : m);
    this.saveDepositMethods();
    return this.depositMethods.find(m => m.id === id);
  }
}

export const helpCenterService = new HelpCenterService();
export default helpCenterService;
