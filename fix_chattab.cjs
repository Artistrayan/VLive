const fs = require('fs');

let content = fs.readFileSync('src/components/Tabs/ChatTab.jsx', 'utf8');

const missingVars = `
  const handleInitiateCall = props.handleInitiateCall || ((type) => showToast(\`Starting \${type} call...\`));
  const [pinnedMessage, setPinnedMessage] = React.useState(props.pinnedMessage || null);
  const t = props.t || ((key) => key);
  const langCode = props.langCode || 'fa';
  const handleTranslateChatMessage = props.handleTranslateChatMessage || ((msg) => showToast('Translated message'));
  const [showAiAssistant, setShowAiAssistant] = React.useState(false);
  const [directInputText, setDirectInputText] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [audioRecordingSeconds] = React.useState(0);
  const handleSendDirectMessage = props.handleSendDirectMessage || (() => {
    if (directInputText.trim()) {
      showToast('Message sent');
      setDirectInputText('');
    }
  });
`;

content = content.replace(
  'const [isChatCallMuted, setIsChatCallMuted] = React.useState(false);',
  'const [isChatCallMuted, setIsChatCallMuted] = React.useState(false);\n' + missingVars
);

fs.writeFileSync('src/components/Tabs/ChatTab.jsx', content);
