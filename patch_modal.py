import re

with open('src/components/LiveStudioModal.jsx', 'r') as f:
    content = f.read()

replacement = """  const isMirrored = facingMode === 'user';

  const [networkQuality, setNetworkQuality] = useState('EXCELLENT'); // 'EXCELLENT' | 'GOOD' | 'POOR'
  const [estimatedBitrate, setEstimatedBitrate] = useState(4500); // kbps

  // Countdown State
  const [countdownNum, setCountdownNum] = useState(3);
  const [isStartingLive, setIsStartingLive] = useState(false);
  const [isLiveKitConnected, setIsLiveKitConnected] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isTrackPublished, setIsTrackPublished] = useState(false);
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitRoom, setLivekitRoom] = useState(null);
  const [livekitServerUrl, setLivekitServerUrl] = useState(getLiveKitConfig().url);
  const [broadcasterAuthorized, setBroadcasterAuthorized] = useState(false);

  // Direct Camera & Microphone Stream Initialization (No permission prompts or blocks)
  const initCameraAndStream = async () => {
    setCameraError(null);
    const opId = ++cameraOperationIdRef.current;
    console.log(`[Camera:${opId}] Direct camera activation starting`);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('MEDIA_NOT_SUPPORTED');
        return;
      }

      // Camera Stream Acquisition directly
      let stream = mediaStreamRef.current || cameraPermissionService.activeStream;
      if (stream && stream.active && stream.getVideoTracks().some(t => t.readyState === 'live')) {
        console.log(`[Camera:${opId}] Reusing existing live active stream`);
        setMediaStream(stream);
        mediaStreamRef.current = stream;
      } else {
        try {
          // Just request it once. If the user denies or there's an error, handle it cleanly.
          // By not specifying exact resolution, we avoid OverconstrainedError and just get the best available.
          stream = await cameraPermissionService.getUserMedia({
            video: { facingMode: facingMode },
            audio: true
          }, opId);
        } catch (err) {
          console.warn(`[Camera:${opId}] Primary getUserMedia failed:`, err);
          // If it fails with audio (e.g. no microphone), fallback to video only
          if (err.name === 'NotReadableError' || err.name === 'NotFoundError') {
            try {
              stream = await cameraPermissionService.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
              }, opId);
            } catch (fallbackErr) {
              throw fallbackErr;
            }
          } else {
            throw err;
          }
        }

        if (opId !== cameraOperationIdRef.current) {
          if (stream) stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (mediaStreamRef.current && mediaStreamRef.current !== stream) {
          mediaStreamRef.current.getTracks().forEach(t => {
            try { t.stop(); } catch(e) {}
          });
        }
        mediaStreamRef.current = stream;
        setMediaStream(stream);
      }

      // Extract Video Track
      const vTrack = stream.getVideoTracks()[0];
      if (vTrack) {"""

# Replace the corrupted block
content = content.replace("  const isMirrored = facingMode === 'user';\n      if (vTrack) {", replacement)

with open('src/components/LiveStudioModal.jsx', 'w') as f:
    f.write(content)
