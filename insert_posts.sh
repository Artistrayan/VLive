sed -i -e '/{activeTab === .about. && (/ {
    r posts_content.jsx
}' src/modals/UserProfileViewModal.jsx
