sed -i 's/await livekitManager.endLiveStream(livekitRoom);/await livekitManager.endLiveStream(activeStreamRecord?.id || livekitRoom);/g' src/components/LiveStudioModal.jsx
