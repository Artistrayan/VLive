const fs = require('fs');

let modalContent = fs.readFileSync('src/modals/AdminDashboardModal.jsx', 'utf8');

// 1. Destructure all the props
const propsDestructuring = `  const {
    isAdminPinModalOpen, setIsAdminPinModalOpen,
    isAdminPanelOpen, setIsAdminPanelOpen,
    showAdminPinModal, setShowAdminPinModal,
    enteredAdminUsername, setEnteredAdminUsername,
    enteredAdminPassword, setEnteredAdminPassword,
    currentTelegramId, isUserRayan,
    adminRolesList, setAdminRolesList,
    activeAdminSession, setActiveAdminSession,
    usersList, setUsersList,
    isAddAdminModalOpen, setIsAddAdminModalOpen,
    newAdminUsername, setNewAdminUsername,
    newAdminPassword, setNewAdminPassword,
    newAdminTelegramId, setNewAdminTelegramId,
    newAdminRole, setNewAdminRole,
    showToast, loc, isRtl,
    adminActiveTab, setAdminActiveTab,
    adminStatsTimeframe, setAdminStatsTimeframe,
    adminUserFilterStatus, setAdminUserFilterStatus,
    adminGlobalSearch, setAdminGlobalSearch,
    adminUsersList, setAdminUsersList,
    adminLivesList, setAdminLivesList,
    adminReportsList, setAdminReportsList,
    adminReportCategoryFilter, setAdminReportCategoryFilter,
    adminWithdrawalsList, setAdminWithdrawalsList,
    adminMaxWithdrawal, setAdminMaxWithdrawal,
    adminMinWithdrawal, setAdminMinWithdrawal,
    adminNetworkFee, setAdminNetworkFee,
    adminPlatformFee, setAdminPlatformFee,
    adminWhitelist, setAdminWhitelist,
    isPayoutFrozen, setIsPayoutFrozen,
    adminAdsList, setAdminAdsList,
    adminEventsList, setAdminEventsList,
    adminNotifTitle, setAdminNotifTitle,
    adminNotifBody, setAdminNotifBody,
    adminNotifCategory, setAdminNotifCategory,
    adminModerationQueue, setAdminModerationQueue,
    adminTicketsList, setAdminTicketsList,
    adminTicketFilter, setAdminTicketFilter,
    adminReplyingTicket, setAdminReplyingTicket,
    adminTicketReplyText, setAdminTicketReplyText,
    adminVipPlans, setAdminVipPlans,
    isAddVipPlanModalOpen, setIsAddVipPlanModalOpen,
    editingVipPlan, setEditingVipPlan,
    newVipPlanTitle, setNewVipPlanTitle,
    newVipPlanCoins, setNewVipPlanCoins,
    newVipPlanUsdt, setNewVipPlanUsdt,
    isAddUserModalOpen, setIsAddUserModalOpen,
    adminNewUser, setAdminNewUser,
    newAdminPermissions, setNewAdminPermissions,
    editingAdminObj, setEditingAdminObj,
    newAdminName, setNewAdminName,
    adminMaintenanceMode, setAdminMaintenanceMode,
    adminAiBadImages, setAdminAiBadImages,
    adminAiOffensiveText, setAdminAiOffensiveText,
    aiSecuritySettings, setAiSecuritySettings,
    aiReportList, setAiReportList,
    aiReportedChatsList, setAiReportedChatsList,
    aiSupportTicketsList, setAiSupportTicketsList,
    aiStreamerVerificationsList, setAiStreamerVerificationsList,
    aiReferralFraudList, setAiReferralFraudList,
    adminBackupsList, setAdminBackupsList,
    adminLogsList, setAdminLogsList,
    addAdminAuditLog,
    handleRunAiReportAnalyzer,
    handleRunAiChatModerator,
    handleGenerateAiSupportReply,
    handleRunAiStreamerVerification,
    handleRunAiReferralFraudCheck
  } = props;`;

const oldPropsRegex = /  const \{\s*isAdminPinModalOpen[\s\S]*?isRtl\s*\} = props;/;
modalContent = modalContent.replace(oldPropsRegex, propsDestructuring);

// 2. Add safeStorage import
if (!modalContent.includes('import { safeStorage }')) {
  modalContent = modalContent.replace(
    "import { useVisualUiEditor } from '../context/VisualUiEditorContext';",
    "import { useVisualUiEditor } from '../context/VisualUiEditorContext';\nimport { safeStorage } from '../utils/safeStorage';"
  );
}

fs.writeFileSync('src/modals/AdminDashboardModal.jsx', modalContent);
