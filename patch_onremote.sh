sed -i '/viewerLiveVideoRef.current.srcObject = stream;/d' src/App.jsx
sed -i '/console.log("ATTACHING WEBRTC STREAM TO VIEWER!", stream);/d' src/App.jsx
sed -i '/viewerLiveVideoRef.current.play().catch(() => {});/d' src/App.jsx
