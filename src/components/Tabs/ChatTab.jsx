import React, { useEffect, useState, useMemo } from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { VerifiedBadge } from '../CommonBadges';
import { supabase } from '../../supabaseClient';
import { apiMessages, apiHome, getUserId, presenceService, calculateAge, getCanonicalConversationId } from '../../services/api';
import { 
  Search, Plus, Filter, MessageSquare, PhoneCall, Video, Pin, BellOff, Trash2, 
  CheckCheck, Send, Mic, Image, Paperclip, Smile, Gift, Sparkles, X, ChevronRight,
  Shield, Check, UserPlus, Phone, Camera, User, Users, Archive, VolumeX, ChevronLeft,
  MoreVertical, Lock, AlertTriangle, Ban, Globe, Bot, MapPin, DollarSign, MicOff,
  UserCheck, Crown, Clock
} from 'lucide-react';

export default function ChatTab(props) {
  const {
    activeTab,
    currentUser,
    currentUsername,
    vipPlan,
    setIsVipModalOpen = (() => {}),
    userRole,
    isUserRayan,
    usersList: propUsersList,
    isAutoTranslateActive: propAutoTranslate,
    setIsAutoTranslateActive: propSetAutoTranslate,
    userAvatar, userName, totalUnreadMessages,
    msgSearchQuery, setMsgSearchQuery,
    msgSearchField, setMsgSearchField,
    msgFilterTab, setMsgFilterTab,
    isCreateGroupModalOpen, setIsCreateGroupModalOpen,
    newGroupName, setNewGroupName,
    newGroupDesc, setNewGroupDesc,
    isNewChatModalOpen, setIsNewChatModalOpen,
    isChatGalleryOpen, setIsChatGalleryOpen,
    isSendGiftInChatOpen, setIsSendGiftInChatOpen,
    conversations, setConversations,
    activeConversationId, setActiveConversationId,
    isChatSearchOpen, setIsChatSearchOpen,
    activeChatCall, setActiveChatCall,
    userCoins: propUserCoins, setUserCoins: propSetUserCoins,
    showToast = (() => {}), loc = ((a, b) => b || a), isRtl
  } = props;

  const [localIsSendCoinsInChatOpen, setLocalIsSendCoinsInChatOpen] = React.useState(false);
  const isSendCoinsInChatOpen = props.isSendCoinsInChatOpen !== undefined ? props.isSendCoinsInChatOpen : localIsSendCoinsInChatOpen;
  const setIsSendCoinsInChatOpen = props.setIsSendCoinsInChatOpen || setLocalIsSendCoinsInChatOpen;

  const [sendCoinsInChatAmount, setSendCoinsInChatAmount] = React.useState(100);
  const [localUserCoins, setLocalUserCoins] = React.useState(5000);
  const userCoins = propUserCoins !== undefined ? propUserCoins : localUserCoins;
  const setUserCoins = propSetUserCoins || setLocalUserCoins;

  const setIsDepositModalOpen = props.setIsDepositModalOpen || (() => showToast('Deposit modal opened'));
  
  const [localIsAutoTranslateActive, setLocalIsAutoTranslateActive] = React.useState(true);
  const isAutoTranslateActive = propAutoTranslate !== undefined ? propAutoTranslate : localIsAutoTranslateActive;
  const setIsAutoTranslateActive = propSetAutoTranslate || setLocalIsAutoTranslateActive;
  const [showChatOptionsMenu, setShowChatOptionsMenu] = React.useState(false);
  const [isChatLocked, setIsChatLocked] = React.useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = React.useState(false);
  const [chatCallSeconds, setChatCallSeconds] = React.useState(45);
  const [isChatCallMuted, setIsChatCallMuted] = React.useState(false);

  const handleInitiateCall = props.handleInitiateCall || ((type) => showToast(`Starting ${type} call...`));
  const [pinnedMessage, setPinnedMessage] = React.useState(props.pinnedMessage || null);
  const t = props.t || ((key) => key);
  const langCode = props.langCode || 'fa';
  const handleTranslateChatMessage = props.handleTranslateChatMessage || ((msg) => showToast('Translated message'));
  const [showAiAssistant, setShowAiAssistant] = React.useState(false);
  const [directInputText, setDirectInputText] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [audioRecordingSeconds] = React.useState(0);
  const [activeUsersList, setActiveUsersList] = useState(propUsersList || []);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  
  const messagesEndRef = React.useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const cv = conversations.find(c => String(c.id) === String(activeConversationId));
    if (activeConversationId && cv?.messages?.length) {
      setTimeout(scrollToBottom, 100);
    }
  }, [activeConversationId, conversations]);

  // Fetch approved registered users if not provided
  useEffect(() => {
    if (propUsersList && propUsersList.length > 0) {
      setActiveUsersList(propUsersList);
    } else {
      apiHome.getApprovedUsers().then(users => {
        if (Array.isArray(users) && users.length > 0) {
          setActiveUsersList(users);
        }
      }).catch(e => console.warn('ChatTab users load note:', e));
    }
  }, [propUsersList]);

  // Load real conversations from Supabase on mount and track online presence
  useEffect(() => {
    let isMounted = true;
    apiMessages.getConversations().then(realConvs => {
      if (isMounted && Array.isArray(realConvs) && realConvs.length > 0) {
        setConversations(prev => {
          const currentList = Array.isArray(prev) ? [...prev] : [];
          realConvs.forEach(rc => {
            const partner = rc.profiles || {};
            const convId = rc.id || rc.conversation_id;
            const isOnline = presenceService.isUserOnline(partner);
            if (!currentList.some(m => String(m.id) === String(convId))) {
              currentList.push({
                id: convId,
                partner_id: partner.id || rc.partner_id || rc.recipient_id,
                user: {
                  id: partner.id || rc.partner_id || rc.recipient_id,
                  username: partner.username || rc.recipient_id || 'User',
                  name: partner.name || partner.username || 'User',
                  avatar: partner.avatar || '',
                  online: isOnline,
                  isOnline: isOnline
                },
                lastMessage: rc.last_message || '',
                lastTime: rc.updated_at ? new Date(rc.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
                unreadCount: 0,
                messages: []
              });
            }
          });
          return currentList;
        });
      }
    }).catch(e => console.warn('ChatTab getConversations sync error:', e));

    const unsubscribePresence = presenceService.subscribe(() => {
      if (!isMounted) return;
      setConversations(prev => {
        if (!Array.isArray(prev)) return prev;
        return prev.map(c => {
          if (!c.user) return c;
          const isOnline = presenceService.isUserOnline(c.user);
          if (c.user.online !== isOnline) {
            return {
              ...c,
              user: { ...c.user, online: isOnline, isOnline: isOnline }
            };
          }
          return c;
        });
      });
    });

    return () => { 
      isMounted = false; 
      unsubscribePresence();
    };
  }, []);

  // Helper to reliably match conversations across various ID formats
  const isTargetConv = (c, activeId, partnerId, canonicalId) => {
    if (!c) return false;
    const cid = String(c.id || '').trim();
    const aid = String(activeId || '').trim();
    const pid = String(partnerId || '').trim();
    const canId = String(canonicalId || '').trim();
    const pUserId = String(c.partner_id || c.user?.id || '').trim();
    const pUsername = String(c.user?.username || '').trim();

    if (aid && cid === aid) return true;
    if (canId && cid === canId) return true;
    if (aid && (pUserId === aid || pUsername === aid)) return true;
    if (pid && (pUserId === pid || pUsername === pid || cid === pid)) return true;
    return false;
  };

  // Compute active conversation safely (never null if activeConversationId is set)
  const currentConv = useMemo(() => {
    if (!activeConversationId) return null;
    const aid = String(activeConversationId).trim();
    const currentUid = getUserId() || currentUser?.id || currentUsername || '';

    let found = (conversations || []).find(c => {
      if (!c) return false;
      const cid = String(c.id || '').trim();
      const pid = String(c.partner_id || c.user?.id || '').trim();
      const pUsername = String(c.user?.username || '').trim();
      if (cid === aid) return true;
      if (pid === aid) return true;
      if (pUsername === aid) return true;
      const canId = (currentUid && (pid || pUsername)) ? getCanonicalConversationId(currentUid, pid || pUsername) : null;
      if (canId && cid === canId) return true;
      return false;
    });

    if (!found) {
      const allUsers = activeUsersList && activeUsersList.length > 0 ? activeUsersList : (propUsersList || []);
      const targetUser = allUsers.find(u => String(u.id).trim() === aid || String(u.username).trim() === aid);
      if (targetUser) {
        found = {
          id: activeConversationId,
          partner_id: targetUser.id,
          user: {
            id: targetUser.id,
            username: targetUser.username,
            name: targetUser.name || targetUser.username,
            avatar: targetUser.avatar || '',
            isVerified: targetUser.isVerified || targetUser.is_verified || false,
            online: targetUser.online || targetUser.isOnline || true,
            role: targetUser.role || 'Member'
          },
          lastMessage: '',
          lastTime: 'Just now',
          unreadCount: 0,
          messages: []
        };
      } else {
        found = {
          id: activeConversationId,
          partner_id: activeConversationId,
          user: {
            id: activeConversationId,
            username: String(activeConversationId),
            name: `User ${String(activeConversationId).slice(0, 8)}`,
            avatar: '',
            online: true
          },
          lastMessage: '',
          lastTime: 'Just now',
          unreadCount: 0,
          messages: []
        };
      }
    }
    return found;
  }, [conversations, activeConversationId, activeUsersList, propUsersList, currentUser, currentUsername]);

  // Determine VIP status of current user
  const isVipUser = useMemo(() => {
    return Boolean(
      currentUser?.is_vip || 
      currentUser?.isVip || 
      vipPlan || 
      userRole === 'admin' || 
      userRole === 'super_admin' || 
      isUserRayan || 
      currentUsername?.toLowerCase() === 'rayan' ||
      (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id === 8933698119)
    );
  }, [currentUser, vipPlan, userRole, isUserRayan, currentUsername]);

  // Compute 10-message limit and first-reply gating rules
  const conversationLimitInfo = useMemo(() => {
    if (!currentConv || currentConv.isGroup || currentConv.type === 'group') {
      return {
        mySentCount: 0,
        receivedReplyCount: 0,
        hasReceivedReply: true,
        isWaitingForFirstReply: false,
        isVipRequired: false,
        freeRemaining: 10
      };
    }

    const currentUid = getUserId() || currentUser?.id || currentUsername || 'me';
    const msgs = Array.isArray(currentConv.messages) ? currentConv.messages : [];
    
    const mySent = msgs.filter(m => m.sender === 'me' || m.sender_id === currentUid);
    const theirReplies = msgs.filter(m => m.sender === 'them' || (m.sender_id && m.sender_id !== currentUid && m.sender_id !== 'me'));
    
    const mySentCount = mySent.length;
    const receivedReplyCount = theirReplies.length;
    const hasReceivedReply = receivedReplyCount > 0;

    // Rule 1: Sender sent 1 or more messages, but partner has not replied yet.
    // If not VIP, they must wait for the partner's reply before continuing the chat.
    const isWaitingForFirstReply = !isVipUser && mySentCount >= 1 && !hasReceivedReply;

    // Rule 2: After reply received, up to 10 total messages sent by this user are free.
    // After 10 messages, VIP membership is required.
    const isVipRequired = !isVipUser && mySentCount >= 10;
    const freeRemaining = Math.max(0, 10 - mySentCount);

    return {
      mySentCount,
      receivedReplyCount,
      hasReceivedReply,
      isWaitingForFirstReply,
      isVipRequired,
      freeRemaining
    };
  }, [currentConv, currentUser, currentUsername, isVipUser]);

  // Sync real messages from Supabase when opening a conversation
  useEffect(() => {
    if (!activeConversationId) return;

    let isMounted = true;
    const currentUid = getUserId() || currentUser?.id || currentUsername || 'me';
    const partnerId = currentConv?.partner_id || currentConv?.user?.id || (currentConv?.user?.username !== currentUid ? currentConv?.user?.username : null) || activeConversationId;
    const canonicalId = (currentUid && partnerId) ? getCanonicalConversationId(currentUid, partnerId) : activeConversationId;

    const loadRealMessages = async () => {
      try {
        const msgs = await apiMessages.getMessages(activeConversationId, partnerId);
        if (isMounted && Array.isArray(msgs)) {
          const formatted = msgs.map(m => ({
            id: m.id || `msg_${Date.now()}_${Math.random()}`,
            sender: (m.sender_id === currentUid || m.sender === 'me') ? 'me' : 'them',
            sender_id: m.sender_id,
            text: m.content || m.message_text || m.text || '',
            content: m.content || m.message_text || m.text || '',
            mediaUrl: m.media_url || m.mediaUrl || '',
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Now',
            created_at: m.created_at,
            raw: m
          }));

          setConversations(prev => {
            const list = Array.isArray(prev) ? [...prev] : [];
            const matchIndex = list.findIndex(c => isTargetConv(c, activeConversationId, partnerId, canonicalId));
            
            if (matchIndex >= 0) {
              const existingConv = list[matchIndex];
              const existingMsgs = existingConv.messages || [];
              const merged = [...formatted];
              existingMsgs.forEach(existing => {
                const alreadyInDb = merged.some(m => m.id === existing.id || (m.text === existing.text && m.sender === existing.sender));
                if (!alreadyInDb) {
                  merged.push(existing);
                }
              });

              list[matchIndex] = {
                ...existingConv,
                messages: merged,
                lastMessage: merged[merged.length - 1]?.text || existingConv.lastMessage
              };
              return list;
            } else if (currentConv) {
              return [{ 
                ...currentConv, 
                id: activeConversationId, 
                partner_id: partnerId,
                messages: formatted, 
                lastMessage: formatted[formatted.length - 1]?.text || '' 
              }, ...list];
            }
            return list;
          });
        }
      } catch (err) {
        console.warn('loadRealMessages error:', err);
      }
    };

    loadRealMessages();

    // 1. Subscribe to realtime incoming messages for active conversation
    const channels = [];
    const convTargets = new Set();
    if (activeConversationId) convTargets.add(activeConversationId);
    if (canonicalId) convTargets.add(canonicalId);

    const handleIncomingMessage = (newMsgRecord) => {
      if (!isMounted || !newMsgRecord) return;
      const isMe = (newMsgRecord.sender_id === currentUid || newMsgRecord.sender === 'me');
      if (isMe) return;

      const incomingFormatted = {
        id: newMsgRecord.id || `msg_${Date.now()}`,
        sender: 'them',
        sender_id: newMsgRecord.sender_id,
        text: newMsgRecord.content || newMsgRecord.message_text || newMsgRecord.text || '',
        content: newMsgRecord.content || newMsgRecord.message_text || newMsgRecord.text || '',
        mediaUrl: newMsgRecord.media_url || newMsgRecord.mediaUrl || '',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const incomingConvId = newMsgRecord.conversation_id;
        const incomingPartnerId = newMsgRecord.sender_id;
        
        let matchIndex = list.findIndex(c => String(c.id) === String(incomingConvId));
        if (matchIndex === -1 && incomingPartnerId) {
          matchIndex = list.findIndex(c => String(c.user?.id) === String(incomingPartnerId));
        }

        if (matchIndex >= 0) {
          const currentMsgs = list[matchIndex].messages || [];
          if (currentMsgs.some(m => m.id === incomingFormatted.id || (m.text === incomingFormatted.text && m.sender === 'them'))) {
            return list;
          }
          
          const isActive = String(list[matchIndex].id) === String(activeConversationId);
          list[matchIndex] = {
            ...list[matchIndex],
            lastMessage: incomingFormatted.text,
            lastTime: incomingFormatted.time,
            unreadCount: isActive ? 0 : ((list[matchIndex].unreadCount || 0) + 1),
            messages: [...currentMsgs, incomingFormatted]
          };
          
          // Move to top
          const updatedConv = list[matchIndex];
          list.splice(matchIndex, 1);
          list.unshift(updatedConv);
          
          return list;
        } else if (currentConv && isTargetConv(currentConv, incomingConvId, incomingPartnerId, null)) {
          // Fallback if currentConv matches but isn't in list yet
          return [{
            ...currentConv,
            id: incomingConvId || activeConversationId,
            partner_id: incomingPartnerId || partnerId,
            lastMessage: incomingFormatted.text,
            lastTime: incomingFormatted.time,
            unreadCount: (String(incomingConvId) === String(activeConversationId)) ? 0 : 1,
            messages: [incomingFormatted]
          }, ...list];
        }
        return list;
      });
    };

    convTargets.forEach(targetId => {
      const ch = apiMessages.subscribeToConversation(targetId, handleIncomingMessage, partnerId);
      if (ch) channels.push(ch);
    });

    // 2. Subscribe to current user personal inboxes
    const userTargets = new Set();
    if (currentUid) userTargets.add(currentUid);
    if (currentUser?.id) userTargets.add(currentUser.id);
    if (currentUser?.username) userTargets.add(currentUser.username);
    if (currentUser?.telegram_id) userTargets.add(currentUser.telegram_id);

    userTargets.forEach(uId => {
      const ch = apiMessages.subscribeToUserInbox(uId, handleIncomingMessage);
      if (ch) channels.push(ch);
    });

    return () => {
      isMounted = false;
      channels.forEach(ch => {
        try { supabase.removeChannel(ch); } catch {}
      });
    };
  }, [activeConversationId, currentConv, currentUser]);

  // Real message send handler
  const handleSendDirectMessage = async (customText) => {
    const textToSend = typeof customText === 'string' ? customText.trim() : directInputText.trim();
    if (!textToSend || !activeConversationId) return;

    if (conversationLimitInfo.isWaitingForFirstReply) {
      showToast(window.loc('⏳ لطفاً منتظر بمانید تا طرف مقابل به پیام اول شما پاسخ دهد.', '⏳ Please wait for recipient to reply to your first message before continuing.'));
      return;
    }

    if (conversationLimitInfo.isVipRequired) {
      showToast(window.loc('👑 سقف ۱۰ پیام رایگان پایان یافت! برای ارسال پیام‌های نامحدود، عضویت VIP را فعال کنید.', '👑 Free 10-message limit reached! Please upgrade to VIP for unlimited messaging.'));
      setIsVipModalOpen?.(true);
      return;
    }

    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentUid = getUserId() || currentUser?.id || currentUsername || 'me';
    const partnerId = currentConv?.partner_id || currentConv?.user?.id || (currentConv?.user?.username !== currentUid ? currentConv?.user?.username : null) || activeConversationId;
    const canonicalId = (currentUid && partnerId) ? getCanonicalConversationId(currentUid, partnerId) : activeConversationId;

    const localMsg = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'me',
      sender_id: currentUid,
      text: textToSend,
      content: textToSend,
      time: nowTime,
      created_at: new Date().toISOString(),
      timestamp: Date.now()
    };

    // 1. Optimistic UI update - instantly shows on screen!
    setConversations(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];
      const matchIndex = list.findIndex(c => isTargetConv(c, activeConversationId, partnerId, canonicalId));

      if (matchIndex >= 0) {
        const existingConv = list[matchIndex];
        const updatedMsgs = [...(existingConv.messages || []), localMsg];
        list[matchIndex] = {
          ...existingConv,
          lastMessage: textToSend,
          lastTime: nowTime,
          messages: updatedMsgs
        };
        return list;
      } else {
        const newConv = {
          ...(currentConv || {}),
          id: activeConversationId,
          partner_id: partnerId,
          lastMessage: textToSend,
          lastTime: nowTime,
          unreadCount: 0,
          messages: [localMsg]
        };
        return [newConv, ...list];
      }
    });

    setDirectInputText('');

    // 2. Real API send to Supabase & Realtime multi-channel broadcast
    try {
      const res = await apiMessages.sendMessage({
        conversationId: activeConversationId,
        recipient: partnerId,
        text: textToSend
      });
      if (res && res.success) {
        if (res.data?.id) {
          setConversations(prev => {
            const list = Array.isArray(prev) ? [...prev] : [];
            const matchIndex = list.findIndex(c => isTargetConv(c, activeConversationId, partnerId, canonicalId));
            if (matchIndex >= 0) {
              list[matchIndex] = {
                ...list[matchIndex],
                messages: (list[matchIndex].messages || []).map(m => m.id === localMsg.id ? { ...m, id: res.data.id } : m)
              };
            }
            return list;
          });
        }
      } else {
        console.error('Direct message send note:', res?.error);
        showToast(window.loc(`خطا در ارسال پیام: ${res?.error || 'خطای نامشخص'}`, `Error sending message: ${res?.error || 'Unknown error'}`));
        
        // Revert optimistic update
        setConversations(prev => {
          const list = Array.isArray(prev) ? [...prev] : [];
          const matchIndex = list.findIndex(c => isTargetConv(c, activeConversationId, partnerId, canonicalId));
          if (matchIndex >= 0) {
            list[matchIndex] = {
              ...list[matchIndex],
              messages: (list[matchIndex].messages || []).filter(m => m.id !== localMsg.id)
            };
          }
          return list;
        });
      }
    } catch (err) {
      console.error('Real direct message send exception:', err);
      showToast(window.loc(`خطا در ارسال پیام: ${err.message || 'خطای نامشخص'}`, `Error sending message: ${err.message || 'Unknown error'}`));
      
      // Revert optimistic update
      setConversations(prev => {
        const list = Array.isArray(prev) ? [...prev] : [];
        const matchIndex = list.findIndex(c => isTargetConv(c, activeConversationId, partnerId, canonicalId));
        if (matchIndex >= 0) {
          list[matchIndex] = {
            ...list[matchIndex],
            messages: (list[matchIndex].messages || []).filter(m => m.id !== localMsg.id)
          };
        }
        return list;
      });
    }
  };


  if (activeTab !== 'messages') return null;

  return (
    <>
        {/* TAB 2: COMPLETE REDESIGNED MESSAGES & DIRECT CHAT SYSTEM */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* 1. HEADER: USER AVATAR, TITLE, SEARCH & CREATION ACTIONS */}
            <VisualSectionWrapper pageId="messages" sectionId="messages_header" defaultLabel="Chat Header & Filter Tags">
            <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/40 shadow-md" 
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      {window.loc('💬 Messages (پیام‌ها)', '💬 Messages')}
                    </h2>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-black text-[10px] shadow-lg animate-pulse">
                        {totalUnreadMessages} New
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Secure Encrypted Chat & LiveKit Calls</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className={"p-2.5 rounded-2xl border transition " + (isChatSearchOpen ? "bg-pink-500 text-white border-pink-400" : "bg-slate-950 text-slate-300 border-slate-800 hover:border-pink-500/40")}
                  title="Search Messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/30 transition shadow-md"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Create Group</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>

            {/* 2. ADVANCED SEARCH BAR (NAME, ID, PHONE, CITY) */}
            {isChatSearchOpen && (
              <div className="card-3d p-3 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Search className="w-4 h-4 text-pink-400 shrink-0" />
                  <input 
                    type="text"
                    value={msgSearchQuery}
                    onChange={e => setMsgSearchQuery(e.target.value)}
                    placeholder="Search by Name, Username ID, City, or Phone..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                  />
                  {msgSearchQuery && (
                    <button onClick={() => setMsgSearchQuery('')} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold text-slate-400">
                  <span className="text-slate-500 shrink-0">Filter By:</span>
                  {[
                    { id: 'all', label: 'All Fields' },
                    { id: 'name', label: 'Name' },
                    { id: 'id', label: 'Username ID' },
                    { id: 'city', label: window.loc('City (شهر)', 'City') },
                    { id: 'phone', label: 'Phone' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setMsgSearchField(f.id)}
                      className={"px-2.5 py-1 rounded-lg shrink-0 transition " + (msgSearchField === f.id ? "bg-pink-600 text-white font-black" : "bg-slate-950 border border-slate-800 hover:text-slate-200")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </VisualSectionWrapper>

            {/* 3. CATEGORY TABS: ALL, PRIVATE, GROUPS, CALLS, ARCHIVED */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: 'All', icon: MessageSquare, badge: conversations.length },
                { id: 'private', label: window.loc('Private (خصوصی)', 'Private'), icon: User, badge: conversations.filter(c => !c.isGroup && !c.archived).length },
                { id: 'groups', label: window.loc('Groups (گروه‌ها)', 'Groups'), icon: Users, badge: conversations.filter(c => c.isGroup).length },
                { id: 'calls', label: window.loc('Calls (تماس‌ها)', 'Calls'), icon: Phone, badge: conversations.filter(c => c.type === 'call').length },
                { id: 'archived', label: window.loc('Archived (بایگانی)', 'Archived'), icon: Archive, badge: conversations.filter(c => c.archived).length }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = msgFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMsgFilterTab(tab.id)}
                    className={"px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0 transition border " + (isActive ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/20" : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200")}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={"px-2 py-0.5 rounded-full text-[9px] " + (isActive ? "bg-white/20 text-white font-black" : "bg-slate-950 text-slate-400")}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MAIN MESSAGES LAYOUT: SIDEBAR + CHAT THREAD */}
            <div className="card-3d rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden h-[calc(100dvh-180px)] md:h-[620px] flex flex-col md:flex-row shadow-2xl relative">
              
              {/* CONVERSATIONS LIST SIDEBAR */}
              <div className={"w-full md:w-80 border-r border-slate-800/80 flex flex-col bg-slate-950 " + (activeConversationId ? "hidden md:flex" : "flex")}>
                <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Recent Conversations</span>
                  <span className="text-[10px] text-pink-400">Live Sync</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {(() => {
                    const filteredConvs = conversations.filter(conv => {
                      if (msgFilterTab === 'private' && (conv.isGroup || conv.archived)) return false;
                      if (msgFilterTab === 'groups' && !conv.isGroup) return false;
                      if (msgFilterTab === 'calls' && conv.type !== 'call') return false;
                      if (msgFilterTab === 'archived' && !conv.archived) return false;
                      if (msgFilterTab === 'all' && conv.archived) return false;

                      if (msgSearchQuery.trim()) {
                        const q = msgSearchQuery.toLowerCase();
                        const nameMatch = conv.user.name?.toLowerCase().includes(q);
                        const idMatch = conv.user.username?.toLowerCase().includes(q);
                        const cityMatch = conv.user.city?.toLowerCase().includes(q);
                        const phoneMatch = conv.user.phone?.includes(q);

                        if (msgSearchField === 'name') return nameMatch;
                        if (msgSearchField === 'id') return idMatch;
                        if (msgSearchField === 'city') return cityMatch;
                        if (msgSearchField === 'phone') return phoneMatch;
                        return nameMatch || idMatch || cityMatch || phoneMatch;
                      }

                      return true;
                    });

                    if (filteredConvs.length === 0) {
                      return (
                        <div className="py-12 text-center space-y-2 text-slate-500 px-4">
                          <MessageSquare className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                          <p className="text-xs font-bold text-slate-400">
                            {window.loc('هیچ گفتگویی یافت نشد', 'No conversation found')}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {window.loc('برای شروع گفتگو دکمه چت جدید را بزنید', 'Click New Chat to start a conversation')}
                          </p>
                        </div>
                      );
                    }

                    return filteredConvs.map(conv => {
                      const isSelected = activeConversationId === conv.id;
                      const cUser = conv.user || {};
                      return (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setActiveConversationId(conv.id);
                            setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                          }}
                          className={"w-full p-3 rounded-2xl flex items-center gap-3 transition text-left border relative group " + (isSelected ? "bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent border-pink-500/50 shadow-md" : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700")}
                        >
                          <div className="relative shrink-0">
                            <img src={cUser.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={cUser.name || 'User'} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            {cUser.online && !conv.isGroup && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                            )}
                            {conv.isGroup && (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-purple-600 text-white ring-2 ring-slate-950">
                                <Users className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                                {cUser.name || 'User'}
                                {cUser.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                                {conv.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono shrink-0">{conv.lastTime}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <p className="text-slate-400 truncate flex-1 pr-2">
                                {conv.lastMessage || window.loc('گفتگو ایجاد شد', 'Conversation created')}
                              </p>

                              {conv.unreadCount > 0 ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-slate-950 font-black text-[9px] shrink-0 shadow-sm">
                                  {conv.unreadCount}
                                </span>
                              ) : conv.muted ? (
                                <VolumeX className="w-3 h-3 text-slate-600 shrink-0" />
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* CHAT THREAD VIEW */}
              <div className={"flex-1 flex flex-col bg-slate-950/60 relative " + (!activeConversationId ? "hidden md:flex" : "flex")}>
                {activeConversationId && currentConv ? (
                  (() => {
                    return (
                      <>
                        {/* 1. CHAT THREAD TOP HEADER */}
                        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
                          <div className="flex items-center gap-3 min-w-0">
                            <button 
                              onClick={() => setActiveConversationId(null)}
                              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="relative shrink-0">
                              <img src={currentConv?.user?.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={currentConv?.user?.name || 'User'} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                              {currentConv?.user?.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-xs font-bold text-white truncate">{currentConv?.user?.name || 'User'}</h3>
                                {currentConv?.user?.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                                {isVipUser && (
                                  <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5 text-amber-400" /> VIP
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  🟢 Online
                                </p>
                                {!isVipUser && !currentConv?.isGroup && (
                                  <span className="text-[9px]">
                                    {conversationLimitInfo.isWaitingForFirstReply ? (
                                      <span className="text-amber-400 font-bold flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {window.loc('در انتظار پاسخ اول', 'Waiting for reply')}
                                      </span>
                                    ) : conversationLimitInfo.isVipRequired ? (
                                      <span className="text-pink-400 font-bold flex items-center gap-1">
                                        <Crown className="w-2.5 h-2.5" />
                                        {window.loc('نیازمند VIP', 'VIP Required')}
                                      </span>
                                    ) : (
                                      <span className="text-cyan-400 font-medium">
                                        💬 {window.loc(`${conversationLimitInfo.freeRemaining} پیام رایگان باقی‌مانده`, `${conversationLimitInfo.freeRemaining} Free Left`)}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Direct Action Buttons in Header */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv?.user, 'voice', '1on1');
                                showToast("Initiating Voice Call with " + (currentConv?.user?.name || 'User') + "...");
                              }}
                              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Voice Call"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv?.user, 'video', '1on1');
                                showToast("Initiating 4K Video Call with " + (currentConv?.user?.name || 'User') + "...");
                              }}
                              className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-bold transition shadow-md"
                              title="Video Call"
                            >
                              <Video className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setIsSendGiftInChatOpen(true)}
                              className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Send Gift"
                            >
                              <Gift className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setIsAutoTranslateActive(!isAutoTranslateActive);
                                showToast(!isAutoTranslateActive 
                                  ? window.loc('ترجمه خودکار پیام‌ها فعال شد 🌐', 'Auto-translation for incoming messages enabled 🌐') 
                                  : window.loc('ترجمه خودکار پیام‌ها غیرفعال شد 🌐', 'Auto-translation for incoming messages disabled 🌐'));
                              }}
                              className={`p-2 rounded-xl font-bold transition shadow-md flex items-center gap-1 border ${
                                isAutoTranslateActive 
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950' 
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                              title={window.loc('ترجمه خودکار پیام‌های دریافتی', 'Auto-translate incoming messages')}
                            >
                              <Globe className={`w-4 h-4 ${isAutoTranslateActive ? 'text-cyan-400 animate-pulse' : ''}`} />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setShowChatOptionsMenu(!showChatOptionsMenu)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {showChatOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-1 animate-fadeIn">
                                  <button
                                    onClick={() => {
                                      setIsChatLocked(!isChatLocked);
                                      setShowChatOptionsMenu(false);
                                      showToast(isChatLocked ? 'Chat unlocked' : '🔒 Chat locked with passcode security');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-300 flex items-center gap-2"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    {isChatLocked ? 'Unlock Chat' : '🔒 Lock Chat'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setIsChatGalleryOpen(true);
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <Image className="w-3.5 h-3.5 text-cyan-400" />
                                    Media Gallery
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('Chat muted');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                                    Mute Notifications
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User reported to moderation');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-400 flex items-center gap-2"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Report User
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User blocked');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-rose-400 flex items-center gap-2"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    Block User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PINNED MESSAGE BANNER */}
                        {pinnedMessage && (
                          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-2 truncate">
                              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                              <span className="font-bold text-[10px] text-amber-400">Pinned:</span>
                              <span className="truncate text-[11px]">{pinnedMessage.text}</span>
                            </div>
                            <button onClick={() => setPinnedMessage(null)} className="p-1 text-slate-400 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* MESSAGES SCROLL AREA */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 custom-scrollbar">
                          {currentConv.messages.map(msg => {
                            const isMe = msg.sender === 'me';
                            return (
                              <div 
                                key={msg.id} 
                                className={"flex flex-col " + (isMe ? "items-end" : "items-start") + " group transition"}
                              >
                                {msg.senderName && !isMe && (
                                  <span className="text-[9px] font-bold text-purple-400 mb-0.5 px-1">{msg.senderName}</span>
                                )}

                                <div className="relative group max-w-[82%]">
                                  <div 
                                    className={"p-3.5 rounded-3xl text-xs space-y-1.5 shadow-xl transition-all duration-300 relative border " + (isMe ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-br-xs border-pink-400/40" : "bg-slate-900/90 text-slate-100 rounded-bl-xs border-slate-800")}
                                  >
                                    {msg.type === 'gift' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-amber-300 font-bold">
                                        <span className="text-2xl">👑</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-amber-400 font-black">+500 Coins Value</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'coins' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                                        <span className="text-2xl">💸</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-emerald-400 font-black">Direct Transfer Completed</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'voice' ? (
                                      <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                                        <button className="w-8 h-8 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                                          ▶
                                        </button>
                                        <div className="flex-1 h-3 flex items-center gap-0.5">
                                          {[40, 70, 30, 90, 100, 60, 80, 50, 90, 40, 70, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-pink-400/60 rounded-full" style={{ height: h + "%" }} />
                                          ))}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-300">0:12</span>
                                      </div>
                                     ) : (
                                       <>
                                         <p className="leading-relaxed whitespace-pre-wrap">
                                           {msg.translated && msg.translation ? (
                                             <span className="block">{msg.translation}</span>
                                           ) : (
                                             msg.text
                                           )}
                                         </p>

                                         {/* INCOMING MESSAGE TRANSLATION TOGGLE */}
                                         {!isMe && (
                                           <div className="pt-1 flex items-center gap-2">
                                             <button
                                               type="button"
                                               onClick={() => handleTranslateChatMessage(msg.id, msg.text)}
                                               className="flex items-center gap-1 text-[9.5px] font-bold text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900/90 px-2.5 py-1 rounded-full border border-cyan-500/40 transition active:scale-95 w-fit shadow-sm"
                                               title={msg.translated ? window.loc('نمایش متن اصلی', 'Show original text') : window.loc('ترجمه به زبان شما', 'Translate to your language')}
                                             >
                                               <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                                               <span>
                                                 {msg.translated 
                                                   ? window.loc('↩️ متن اصلی', '↩️ Show Original') 
                                                   : window.loc('🌐 ترجمه پیام', '🌐 Translate Message')}
                                               </span>
                                             </button>

                                             {msg.translated && msg.translation && (
                                               <span className="inline-flex items-center gap-1 text-[9px] text-cyan-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                                                 🌐 {t('translated', window.loc('ترجمه‌شده', 'Translated'))} ({msg.translationLang || langCode})
                                               </span>
                                             )}
                                           </div>
                                         )}
                                       </>
                                     )}

                                    {msg.reactions && msg.reactions.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 shrink-0 w-fit text-[11px]">
                                        {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-end gap-1 text-[8px] text-slate-300 pt-1">
                                      <span>{msg.time}</span>
                                      {isMe && (
                                        <CheckCheck className="w-3 h-3 text-cyan-300" title="Read" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="hidden group-hover:flex items-center gap-1.5 absolute -top-3 right-2 bg-slate-900/95 border border-slate-700/80 rounded-full px-2.5 py-1 shadow-2xl text-[10px] z-20 backdrop-blur-md">
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '❤️'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Heart"
                                    >
                                      ❤️
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '🔥'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Fire"
                                    >
                                      🔥
                                    </button>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard?.writeText(msg.text);
                                        showToast(window.loc('متن پیام کپی شد 📋', 'The text of the message was copied 📋'));
                                      }}
                                      className="text-slate-300 hover:text-white font-bold"
                                      title={window.loc('کپی متن', 'Copy text')}
                                    >
                                      📋
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setPinnedMessage(msg);
                                        showToast(window.loc('پیام سنجاق شد 📌', 'The message has been pinned'));
                                      }}
                                      className="text-amber-400 hover:text-white"
                                      title={window.loc('سنجاق پیام', 'Message pin')}
                                    >
                                      📌
                                    </button>
                                    <button 
                                      onClick={() => handleTranslateChatMessage(msg.id, msg.text)}
                                      className="text-cyan-400 hover:text-white font-bold"
                                      title={window.loc('ترجمه پیام', 'Translation of the message')}
                                    >
                                      🌍
                                    </button>
                                    <button 
                                      onClick={async () => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.filter(m => m.id !== msg.id)
                                            };
                                          }
                                          return c;
                                        }));
                                        showToast(window.loc('پیام حذف شد 🗑️', 'The message was deleted 🗑️'));
                                        if (msg.id && typeof msg.id !== 'string' || !String(msg.id).startsWith('msg_')) {
                                          apiMessages.deleteMessage(msg.id).then(res => {
                                            if (res && !res.success) {
                                              console.warn("Could not delete message on server:", res.error);
                                            }
                                          });
                                        }
                                      }}
                                      className="text-rose-400 hover:text-rose-300 font-bold"
                                      title={window.loc('حذف پیام', 'Delete message')}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* POPOVERS: AI ASSISTANT, EMOJIS, ATTACHMENTS */}
                        {showAiAssistant && (
                          <div className="p-3 bg-slate-900 border-t border-purple-500/40 space-y-2 animate-fadeIn z-20">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <Bot className="w-4 h-4 text-purple-400" />
                                {window.loc('🤖 AI Chat Assistant (هوش مصنوعی)', '🤖 AI Chat Assistant')}
                              </span>
                              <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-bold">
                              {[
                                'Thanks for your live! 💖',
                                "Let's do a video call 📹",
                                'How are you doing today? 😊',
                                'Sent you a gift! 🎁'
                              ].map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(suggestion);
                                    setShowAiAssistant(false);
                                  }}
                                  className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition text-left truncate"
                                >
                                  ✨ {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showEmojiPicker && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 animate-fadeIn z-20">
                            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-300">
                              <span>😀 Emojis & Quick Reaction</span>
                              <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xl">
                              {['😀', '😂', '😍', '🔥', '👑', '💖', '👍', '🏎️', '🎉', '🚀', '💎', '🌹', '💯', '✨', '👏'].map((emoji, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="hover:scale-125 transition p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showAttachmentMenu && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-bold animate-fadeIn z-20">
                            <button onClick={() => { showToast('Attach photo'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-pink-400 hover:border-pink-500 flex flex-col items-center gap-1">
                              <Image className="w-5 h-5" /> Photo
                            </button>
                            <button onClick={() => { showToast('Attach video'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-purple-400 hover:border-purple-500 flex flex-col items-center gap-1">
                              <Video className="w-5 h-5" /> Video
                            </button>
                            <button onClick={() => { showToast('Attach file'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 hover:border-cyan-500 flex flex-col items-center gap-1">
                              <Paperclip className="w-5 h-5" /> File
                            </button>
                            <button onClick={() => { showToast('Share location'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 flex flex-col items-center gap-1">
                              <MapPin className="w-5 h-5" /> Location
                            </button>
                          </div>
                        )}

                        {conversationLimitInfo.isWaitingForFirstReply ? (
                          <div className="p-4 border-t border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 z-20 animate-fadeIn">
                            <div className="flex items-center gap-3 text-right">
                              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                                <Clock className="w-5 h-5 animate-pulse" />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                                  <span>{window.loc('در انتظار پاسخ مخاطب به پیام اول', 'Waiting for recipient reply')}</span>
                                </h4>
                                <p className="text-[11px] text-slate-300 leading-snug max-w-md">
                                  {window.loc('پیام اول شما با موفقیت ارسال شد. جهت جلوگیری از اسپم، ادامه گفتگو (تا سقف ۱۰ پیام رایگان) پس از دریافت اولین پاسخ از طرف مخاطب فعال خواهد شد.', 'Your first message has been sent. To prevent spam, continuing the chat (up to 10 free messages) will unlock once the recipient replies.')}
                                </p>
                              </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px] shrink-0 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                              <span>{window.loc('منتظر پاسخ مخاطب...', 'Waiting for reply...')}</span>
                            </div>
                          </div>
                        ) : conversationLimitInfo.isVipRequired ? (
                          <div className="p-4 border-t border-pink-500/40 bg-gradient-to-r from-slate-950 via-purple-950/80 to-pink-950/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 z-20 animate-fadeIn shadow-2xl">
                            <div className="flex items-center gap-3 text-right">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-pink-500 p-0.5 shadow-lg shadow-pink-500/25 shrink-0">
                                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400">
                                  <Crown className="w-5 h-5 animate-bounce" />
                                </div>
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                                  <span className="text-amber-400 font-black">{window.loc('سقف ۱۰ پیام رایگان پایان یافت', 'Free 10 messages limit reached')}</span>
                                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[9px] text-amber-300 font-bold">VIP Required</span>
                                </h4>
                                <p className="text-[11px] text-slate-300 leading-snug max-w-md">
                                  {window.loc('برای ادامه گفتگوی نامحدود و ارسال پیام‌های بیشتر با این کاربر، اشتراک VIP خود را فعال کنید.', 'To continue unlimited messaging with this user, please activate your VIP membership.')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsVipModalOpen?.(true)}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
                            >
                              <Crown className="w-4 h-4 text-amber-200" />
                              <span>{window.loc('👑 ارتقا به عضویت VIP', '👑 Upgrade to VIP')}</span>
                            </button>
                          </div>
                        ) : isRecordingAudio ? (
                          <div className="p-3 bg-pink-950/80 border-t border-pink-500/50 flex items-center justify-between text-xs font-bold animate-pulse z-20">
                            <div className="flex items-center gap-2 text-pink-300">
                              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
                              <span>Recording Voice Note... ({audioRecordingSeconds}s)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsRecordingAudio(false)} 
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] hover:text-white"
                              >
                                Cancel
                              </button>

                              <button 
                                onClick={() => {
                                  if (conversationLimitInfo.isWaitingForFirstReply) {
                                    showToast(window.loc('⏳ لطفاً منتظر بمانید تا طرف مقابل به پیام اول شما پاسخ دهد.', '⏳ Please wait for recipient to reply to your first message.'));
                                    setIsRecordingAudio(false);
                                    return;
                                  }
                                  if (conversationLimitInfo.isVipRequired) {
                                    showToast(window.loc('👑 سقف ۱۰ پیام رایگان پایان یافت! عضویت VIP را فعال کنید.', '👑 Free 10 messages limit reached! Upgrade to VIP.'));
                                    setIsVipModalOpen?.(true);
                                    setIsRecordingAudio(false);
                                    return;
                                  }
                                  setIsRecordingAudio(false);
                                  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                  setConversations(prev => prev.map(c => {
                                    if (c.id === activeConversationId) {
                                      const newMsg = {
                                        id: Date.now(),
                                        sender: 'me',
                                        text: '🎤 Voice Note (0:12)',
                                        type: 'voice',
                                        time: nowTime
                                      };
                                      return { ...c, lastMessage: '🎤 Voice Note', lastTime: nowTime, messages: [...c.messages, newMsg] };
                                    }
                                    return c;
                                  }));
                                  showToast('Voice note sent!');
                                }}
                                className="px-4 py-1.5 rounded-xl btn-neon-pink text-[10px] text-white font-black"
                              >
                                Send Voice
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Sub-bar showing remaining free messages or VIP status */}
                            {!isVipUser && !currentConv.isGroup && (
                              <div className="px-4 py-1.5 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                                {conversationLimitInfo.mySentCount === 0 ? (
                                  <span className="text-pink-300 font-medium flex items-center gap-1">
                                    🎁 {window.loc('پیام اول کاملاً رایگان است. پس از پاسخ طرف مقابل، تا ۱۰ پیام رایگان خواهید داشت.', '1st message is free. After partner replies, you get 10 free messages.')}
                                  </span>
                                ) : (
                                  <span className="text-cyan-300 font-medium flex items-center gap-1">
                                    💬 {window.loc(`${conversationLimitInfo.freeRemaining} پیام رایگان از ۱۰ پیام باقی‌مانده است.`, `${conversationLimitInfo.freeRemaining} of 10 free messages remaining.`)}
                                  </span>
                                )}
                                <button 
                                  onClick={() => setIsVipModalOpen?.(true)}
                                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition"
                                >
                                  <Crown className="w-3 h-3" />
                                  <span>{window.loc('عضویت VIP', 'VIP Plan')}</span>
                                </button>
                              </div>
                            )}

                            <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2 z-10 flex-wrap sm:flex-nowrap">
                              <button 
                                onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); setShowAiAssistant(false); }}
                                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                                title="Emoji"
                              >
                                <Smile className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); setShowAiAssistant(false); }}
                                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400 transition"
                                title="Attachment"
                              >
                                <Paperclip className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => { setShowAiAssistant(!showAiAssistant); setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
                                className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition shadow-md"
                                title="AI Assistant"
                              >
                                <Bot className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => setIsSendCoinsInChatOpen(true)}
                                className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition font-black text-xs hidden sm:flex items-center gap-1"
                                title="Send Coins"
                              >
                                <DollarSign className="w-4 h-4" />
                              </button>

                              <input 
                                type="text"
                                value={directInputText}
                                onChange={e => setDirectInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                                placeholder={window.loc('Write a message... (تایپ پیام)', 'Write a message...')}
                                className="flex-1 min-w-[120px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500/80 transition"
                              />

                              <button 
                                onClick={() => setIsRecordingAudio(true)}
                                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                                title="Record Voice"
                              >
                                <Mic className="w-4 h-4" />
                              </button>

                              <button 
                                onClick={() => handleSendDirectMessage()}
                                className="p-2.5 rounded-2xl btn-neon-pink shadow-lg hover:scale-105 active:scale-95 transition"
                              >
                                <Send className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 sm:p-8 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 shadow-xl animate-bounce">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">{window.loc('گفتگویی را انتخاب کنید یا چت جدید بسازید', 'Select a conversation or start a new chat')}</h3>
                      <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                        {window.loc('امکان ارسال پیام متنی، ویس، عکس، و هدایا با کاربران و استریمرهای وی‌لایو', 'Send text messages, voice notes, photos, and gifts with V.Live users and streamers.')}
                      </p>
                    </div>

                    <button 
                      onClick={() => setIsNewChatModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{window.loc('➕ شروع چت جدید با کاربران', '➕ Start New Chat with Users')}</span>
                    </button>

                    {/* Quick Contacts List */}
                    {activeUsersList && activeUsersList.length > 0 && (
                      <div className="w-full max-w-md pt-4 space-y-2 text-right dir-rtl">
                        <span className="text-[11px] font-bold text-slate-400 block px-1">
                          {window.loc('کاربران فعال و آنلاین برای پیام مستقیم:', 'Active users online for direct message:')}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeUsersList.slice(0, 6).map((u, i) => (
                            <button
                              key={u.id || i}
                              onClick={() => {
                                const currentUid = getUserId();
                                const targetId = u.id || u.username;
                                const convId = currentUid ? getCanonicalConversationId(currentUid, targetId) : targetId;
                                
                                const newConv = {
                                  id: convId,
                                  partner_id: u.id || u.username,
                                  user: {
                                    id: u.id,
                                    username: u.username,
                                    name: u.name || u.username,
                                    avatar: u.avatar || '',
                                    isVerified: u.isVerified || u.is_verified || false,
                                    online: u.online || u.isOnline || true,
                                    role: u.role || 'Member'
                                  },
                                  lastMessage: '',
                                  lastTime: 'Just now',
                                  unreadCount: 0,
                                  messages: []
                                };

                                setConversations(prev => {
                                  const list = Array.isArray(prev) ? prev : [];
                                  if (!list.some(c => String(c.id) === String(convId))) {
                                    return [newConv, ...list];
                                  }
                                  return list;
                                });

                                setActiveConversationId(convId);
                              }}
                              className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-pink-500/50 flex items-center gap-2.5 transition text-right group"
                            >
                              <div className="relative shrink-0">
                                <img src={u.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={u.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-800 group-hover:ring-pink-500 transition" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">{u.name || u.username}</p>
                                <span className="text-[10px] text-pink-400 font-mono">@{u.username}</span>
                              </div>
                              <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* IN-CHAT ACTIVE CALL OVERLAY MODAL */}
            {activeChatCall && (
              <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white animate-fadeIn">
                <div className="text-center space-y-2 mt-8">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 justify-center mx-auto w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live LiveKit {activeChatCall.type === 'video' ? '4K Video' : 'HD Voice'} Call Active
                  </span>
                  <h3 className="text-2xl font-black">{activeChatCall?.user?.name || 'User'}</h3>
                  <p className="text-sm text-slate-400 font-mono">Duration: {Math.floor(chatCallSeconds / 60).toString().padStart(2, '0')}:{(chatCallSeconds % 60).toString().padStart(2, '0')}</p>
                </div>

                <div className="relative my-auto flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full ring-4 ring-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.5)] overflow-hidden animate-pulse">
                    <img src={activeChatCall?.user?.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={activeChatCall?.user?.name || 'User'} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsChatCallMuted(!isChatCallMuted)}
                    className={"p-4 rounded-full border transition " + (isChatCallMuted ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-200 border-slate-700")}
                  >
                    {isChatCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveChatCall(null);
                      showToast('Call ended');
                    }}
                    className="p-5 rounded-full bg-rose-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition ring-4 ring-rose-500/40"
                    title="End Call"
                  >
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND COINS MODAL */}
            {isSendCoinsInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      💸 Send Coins Direct Transfer
                    </h3>
                    <button onClick={() => setIsSendCoinsInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Send coins instantly from your balance ({userCoins.toLocaleString()} Coins) to recipient wallet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-bold">Coins Amount</label>
                    <input 
                      type="number"
                      value={sendCoinsInChatAmount}
                      onChange={e => setSendCoinsInChatAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (userCoins < sendCoinsInChatAmount) {
                        showToast('Insufficient coins balance!');
                        setIsDepositModalOpen(true);
                        return;
                      }

                      setUserCoins(prev => prev - sendCoinsInChatAmount);
                      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                      setConversations(prev => prev.map(c => {
                        if (c.id === activeConversationId) {
                          const newMsg = {
                            id: Date.now(),
                            sender: 'me',
                            text: "Sent +" + sendCoinsInChatAmount + " Coins 💸",
                            type: 'coins',
                            time: nowTime
                          };
                          return { ...c, lastMessage: "Sent +" + sendCoinsInChatAmount + " Coins", lastTime: nowTime, messages: [...c.messages, newMsg] };
                        }
                        return c;
                      }));

                      setIsSendCoinsInChatOpen(false);
                      showToast("Successfully sent " + sendCoinsInChatAmount + " Coins!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition"
                  >
                    Confirm & Send Coins
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND GIFT MODAL */}
            {isSendGiftInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/40 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      🎁 Send Gift in Direct Chat
                    </h3>
                    <button onClick={() => setIsSendGiftInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { name: 'Rose', icon: '🌹', coins: 10 },
                      { name: 'Heart', icon: '❤️', coins: 50 },
                      { name: 'Diamond', icon: '💎', coins: 500 },
                      { name: 'Crown', icon: '👑', coins: 2500 }
                    ].map((g, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (userCoins < g.coins) {
                            showToast('Insufficient coin balance!');
                            setIsDepositModalOpen(true);
                            return;
                          }

                          setUserCoins(prev => prev - g.coins);
                          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                          setConversations(prev => prev.map(c => {
                            if (c.id === activeConversationId) {
                              const newMsg = {
                                id: Date.now(),
                                sender: 'me',
                                text: "Sent " + g.name + " " + (g.emoji || '🎁'),
                                type: 'gift',
                                time: nowTime
                              };
                              return { ...c, lastMessage: "Sent " + g.name + " " + (g.emoji || '🎁'), lastTime: nowTime, messages: [...c.messages, newMsg] };
                            }
                            return c;
                          }));

                          setIsSendGiftInChatOpen(false);
                          showToast("Sent " + g.name + " " + (g.emoji || '🎁') + "!");
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 space-y-1 transition"
                      >
                        <span className="text-2xl flex items-center justify-center text-amber-300">
                          {g.emoji ? g.emoji : <g.icon className="w-6 h-6 mx-auto" />}
                        </span>
                        <p className="font-bold text-white text-[11px]">{g.name}</p>
                        <span className="text-[10px] text-amber-300 font-black">{g.coins} Coins</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATE GROUP MODAL */}
            {isCreateGroupModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      {window.loc('👥 Create New Group (ساخت گروه جدید)', '👥 Create New Group')}
                    </h3>
                    <button onClick={() => setIsCreateGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">{window.loc('Group Name (نام گروه)', 'Group Name')}</label>
                      <input 
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="e.g. VIP Streamers Club"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">{window.loc('Description (توضیحات)', 'Description')}</label>
                      <input 
                        type="text"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        placeholder="Group purpose & rules..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newGroupName.trim()) {
                        showToast('Please enter a group name');
                        return;
                      }

                      const newGroup = {
                        id: "group_" + Date.now(),
                        type: 'group',
                        isGroup: true,
                        groupName: newGroupName,
                        user: {
                          username: "group_" + Date.now(),
                          name: newGroupName,
                          avatar: '',
                          isVerified: true,
                          role: 'Group Admin',
                          online: true
                        },
                        lastMessage: '',
                        lastTime: 'Just now',
                        unreadCount: 0,
                        messages: []
                      };

                      setConversations(prev => [newGroup, ...prev]);
                      setIsCreateGroupModalOpen(false);
                      setNewGroupName('');
                      setNewGroupDesc('');
                      showToast("Group \"" + newGroupName + "\" created successfully!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
                  >
                    Create Group Now
                  </button>
                </div>
              </div>
            )}

            {/* MEDIA GALLERY MODAL */}
            {isChatGalleryOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-cyan-400" />
                      🖼️ Shared Media Gallery
                    </h3>
                    <button onClick={() => setIsChatGalleryOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      '',
                      '',
                      ''
                    ].map((img, i) => (
                      <img key={i} src={img} alt="media" className="w-full h-24 rounded-2xl object-cover ring-1 ring-slate-800" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NEW CHAT / USER SELECTION MODAL */}
            {isNewChatModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4" dir={isRtl ? "rtl" : "ltr"}>
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-pink-500/40 max-w-md w-full space-y-4 animate-scaleUp max-h-[85vh] flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-pink-400" />
                      <span>{window.loc('💬 شروع گفتگوی جدید', '💬 Start New Direct Chat')}</span>
                    </h3>
                    <button onClick={() => setIsNewChatModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search user input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                    <input 
                      type="text"
                      value={newChatSearchQuery}
                      onChange={e => setNewChatSearchQuery(e.target.value)}
                      placeholder={window.loc('جستجوی کاربر یا استریمر...', 'Search user or streamer...')}
                      className="w-full pl-3 pr-9 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Users list */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {(() => {
                      const allUsers = activeUsersList && activeUsersList.length > 0 ? activeUsersList : (propUsersList || []);
                      const filtered = allUsers.filter(u => {
                        if (!newChatSearchQuery.trim()) return true;
                        const q = newChatSearchQuery.toLowerCase();
                        return (u.name && u.name.toLowerCase().includes(q)) || (u.username && u.username.toLowerCase().includes(q));
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                            <User className="w-8 h-8 mx-auto text-slate-600" />
                            <p>{window.loc('کاربری با این مشخصات یافت نشد', 'No user found')}</p>
                          </div>
                        );
                      }

                      return filtered.map((targetUser, idx) => (
                        <div
                          key={targetUser.id || idx}
                          onClick={() => {
                            const currentUid = getUserId();
                            const targetId = targetUser.id || targetUser.username;
                            const convId = currentUid ? getCanonicalConversationId(currentUid, targetId) : targetId;
                            
                            const newConv = {
                              id: convId,
                              partner_id: targetUser.id || targetUser.username,
                              user: {
                                id: targetUser.id,
                                username: targetUser.username,
                                name: targetUser.name || targetUser.username,
                                avatar: targetUser.avatar || '',
                                isVerified: targetUser.isVerified || targetUser.is_verified || false,
                                online: targetUser.online || targetUser.isOnline || true,
                                role: targetUser.role || 'Member'
                              },
                              lastMessage: '',
                              lastTime: 'Just now',
                              unreadCount: 0,
                              messages: []
                            };

                            setConversations(prev => {
                              const list = Array.isArray(prev) ? prev : [];
                              if (!list.some(c => String(c.id) === String(convId))) {
                                return [newConv, ...list];
                              }
                              return list;
                            });

                            setActiveConversationId(convId);
                            setIsNewChatModalOpen(false);
                            setNewChatSearchQuery('');
                          }}
                          className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-pink-500/60 flex items-center justify-between gap-3 cursor-pointer transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img 
                                src={targetUser.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} 
                                alt={targetUser.name} 
                                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-800 group-hover:ring-pink-500 transition" 
                              />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-white truncate">{targetUser.name || targetUser.username}</h4>
                                {(targetUser.isVerified || targetUser.is_verified) && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-pink-400 font-mono">@{targetUser.username}</p>
                            </div>
                          </div>

                          <button className="px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 group-hover:bg-pink-500 group-hover:text-white text-xs font-bold transition flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>{window.loc('چت', 'Chat')}</span>
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
    </>
  );
}
