sed -i 's/const attachRemoteTrack = (track) => {/const attachRemoteTrack = (payload) => { const track = payload?.track || payload;/g' src/App.jsx
