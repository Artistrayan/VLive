class CameraPermissionService {
  constructor() {
    this.activeStream = null;
    this.currentFacingMode = 'user';
    this.permissionState = { camera: null, microphone: null };
    this.deviceList = [];
    this._initPromise = null;
  }

  async checkCameraPermission() {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const res = await navigator.permissions.query({ name: 'camera' });
        this.permissionState.camera = res.state;
        return res.state; // 'granted', 'prompt', 'denied'
      }
    } catch (e) {}
    return this.permissionState.camera || 'prompt';
  }

  async checkMicPermission() {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const res = await navigator.permissions.query({ name: 'microphone' });
        this.permissionState.microphone = res.state;
        return res.state;
      }
    } catch (e) {}
    return this.permissionState.microphone || 'prompt';
  }

  async ensurePermissions({ video = true, audio = true } = {}) {
    // If we already have an active stream with matching tracks, return immediately
    if (this.activeStream && this.activeStream.active) {
      const hasVideo = !video || this.activeStream.getVideoTracks().some(t => t.readyState === 'live');
      const hasAudio = !audio || this.activeStream.getAudioTracks().some(t => t.readyState === 'live');
      if (hasVideo && hasAudio) {
        return { camera: 'granted', microphone: 'granted' };
      }
    }

    try {
      const stream = await this.getUserMedia({ video, audio });
      return { camera: 'granted', microphone: 'granted' };
    } catch (err) {
      throw new Error('Permission denied for camera/microphone');
    }
  }

  async getVideoTrackForFacingMode(facingMode = 'user', oldTrack = null, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    // 1. Try in-place applyConstraints on existing live track first (zero-prompt, seamless)
    if (oldTrack && oldTrack.readyState === 'live' && typeof oldTrack.applyConstraints === 'function') {
      try {
        await oldTrack.applyConstraints({
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        });
        return { track: oldTrack, isNewTrack: false, stream: this.activeStream };
      } catch (errApply) {
        console.log(`[CameraPermission] applyConstraints not supported for facing change, acquiring new track`);
      }
    }

    // 2. Single clean getUserMedia call with ideal facingMode (NEVER exact: to avoid OverconstrainedError & duplicate prompts)
    let newStream = null;
    try {
      // Find matching device ID if devices are enumerated
      let targetDeviceId = null;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devices.filter(d => d.kind === 'videoinput');
        if (videoDevs.length > 1) {
          const match = videoDevs.find(d => {
            const label = (d.label || '').toLowerCase();
            return facingMode === 'environment'
              ? (label.includes('back') || label.includes('rear') || label.includes('environment'))
              : (label.includes('front') || label.includes('user') || label.includes('face'));
          });
          if (match) {
            targetDeviceId = match.deviceId;
          }
        }
      } catch (enumErr) {}

      const videoConstraints = targetDeviceId
        ? { deviceId: { ideal: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } };

      newStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false
      });
    } catch (err) {
      // Direct graceful fallback
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
    }

    const newTrack = newStream.getVideoTracks()[0];
    if (newTrack && newTrack.readyState === 'live') {
      return { track: newTrack, isNewTrack: true, stream: newStream };
    }
    throw new Error('FAILED_TO_ACQUIRE_CAMERA_TRACK');
  }

  async getUserMedia(constraints = { video: true, audio: true }, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    // If an existing stream with live tracks matches the request, reuse it
    if (this.activeStream && this.activeStream.active) {
      const vOk = !constraints.video || this.activeStream.getVideoTracks().some(t => t.readyState === 'live');
      const aOk = !constraints.audio || this.activeStream.getAudioTracks().some(t => t.readyState === 'live');
      if (vOk && aOk) {
        return this.activeStream;
      }
    }

    // Clean constraints to avoid OverconstrainedError and multiple prompt cascades
    const sanitizedConstraints = { ...constraints };
    if (typeof sanitizedConstraints.video === 'object' && sanitizedConstraints.video !== null) {
      if (sanitizedConstraints.video.facingMode && typeof sanitizedConstraints.video.facingMode === 'string') {
        sanitizedConstraints.video = {
          ...sanitizedConstraints.video,
          facingMode: { ideal: sanitizedConstraints.video.facingMode }
        };
      }
    }

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(sanitizedConstraints);
    } catch (err) {
      // If combined audio/video fails due to missing mic, try video only in a single fallback
      if (sanitizedConstraints.audio && (err.name === 'NotFoundError' || err.name === 'NotReadableError' || err.name === 'OverconstrainedError')) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: sanitizedConstraints.video || true,
          audio: false
        });
      } else {
        throw err;
      }
    }

    this.activeStream = stream;
    if (constraints.video) this.permissionState.camera = 'granted';
    if (constraints.audio) this.permissionState.microphone = 'granted';

    return stream;
  }

  stopActiveStream() {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      this.activeStream = null;
    }
  }

  setActiveStream(stream) {
    if (stream && stream.active) {
      this.activeStream = stream;
    }
  }
}

export const cameraPermissionService = new CameraPermissionService();
export default cameraPermissionService;
