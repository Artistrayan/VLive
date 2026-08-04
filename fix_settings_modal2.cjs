const fs = require('fs');

let content = fs.readFileSync('src/modals/SettingsModal.jsx', 'utf8');

const moreStates = `
  const [editUsernameInput, setEditUsernameInput] = React.useState(props.editUsernameInput || '');
  const usersList = props.usersList || [];
  const adminUsersList = props.adminUsersList || [];
  const setCurrentUsername = props.setCurrentUsername || (() => {});
  const [showEditPasswordOld, setShowEditPasswordOld] = React.useState(false);
  const [editPasswordOld, setEditPasswordOld] = React.useState('');
  const [showEditPasswordNew, setShowEditPasswordNew] = React.useState(false);
  const [editPasswordNew, setEditPasswordNew] = React.useState('');
`;

content = content.replace(
  "const [deletePassInput, setDeletePassInput] = React.useState('');",
  "const [deletePassInput, setDeletePassInput] = React.useState('');\n" + moreStates
);

fs.writeFileSync('src/modals/SettingsModal.jsx', content);
