class CameraPermissionService {
  constructor() {
    this.activeStream = null;
    this.currentFacingMode = 'user';
  }

  /**
   * Always return granted without any permission prompts or blocker loops
   */
  async checkCameraPermission() {
    return 'granted';
  }

  /**
   * Always return granted without any permission prompts or blocker loops
   */
  async checkMicPermission() {
    return 'granted';
  }

  /**
   * Direct resolution - no intermediate permission prompt
   */
  async requestCameraPermission() {
    return 'granted';
  }

  /**
   * Direct resolution - no intermediate permission prompt
   */
  async ensurePermissions({ video = true, audio = true } = {}) {
    return { camera: 'granted', microphone: 'granted' };
  }

  /**
   * Directly acquire video track for facing mode (user vs environment)
   */
  async getVideoTrackForFacingMode(facingMode = 'user', oldTrack = null, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    // STEP 1: Attempt seamless in-place constraint switch on the existing track if possible
    if (oldTrack && oldTrack.readyState === 'live' && typeof oldTrack.applyConstraints === 'function') {
      try {
        console.log(`[Camera:${opId}] In-place switch to facingMode: ${facingMode}`);
        await oldTrack.applyConstraints({
          facingMode: { ideal: facingMode }
        });
        const currentSettings = typeof oldTrack.getSettings === 'function' ? oldTrack.getSettings() : {};
        if (currentSettings.facingMode === facingMode) {
          return { track: oldTrack, isNewTrack: false, stream: null };
        }
      } catch (applyErr) {
        console.log(`[Camera:${opId}] In-place applyConstraints failed, acquiring fresh stream`);
      }
    }

    // STEP 2: Directly acquire new stream with target facingMode
    let newStream = null;
    let newTrack = null;

    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      newTrack = newStream.getVideoTracks()[0];
    } catch (err1) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false
        });
        newTrack = newStream.getVideoTracks()[0];
      } catch (err2) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        newTrack = newStream.getVideoTracks()[0];
      }
    }

    if (newTrack && newTrack.readyState === 'live') {
      return { track: newTrack, isNewTrack: true, stream: newStream };
    }

    throw new Error('FAILED_TO_ACQUIRE_CAMERA_TRACK');
  }

  /**
   * Direct getUserMedia - opens camera without any permission checks
   */
  async getUserMedia(constraints = { video: true, audio: true }, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.activeStream = stream;
      return stream;
    } catch (err) {
      // Fallback with basic constraints directly
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: typeof constraints.video === 'object' && constraints.video?.facingMode ? { facingMode: constraints.video.facingMode } : true,
          audio: Boolean(constraints.audio)
        });
        this.activeStream = fallbackStream;
        return fallbackStream;
      } catch (fallbackErr) {
        const minimalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.activeStream = minimalStream;
        return minimalStream;
      }
    }
  }

  /**
   * Stop current active camera stream
   */
  stopActiveStream() {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      this.activeStream = null;
    }
  }

  /**
   * Set active stream
   */
  setActiveStream(stream) {
    if (stream && stream.active) {
      this.activeStream = stream;
    }
  }
}

export const cameraPermissionService = new CameraPermissionService();
export default cameraPermissionService;
