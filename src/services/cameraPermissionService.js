class CameraPermissionService {
  constructor() {
    this.activeStream = null;
    this.currentFacingMode = 'user';
    this.isRequesting = false;
  }

  /**
   * Checks the actual camera permission state without triggering prompt
   * Returns 'granted' | 'denied' | 'prompt'
   */
  async checkCameraPermission() {
    // 1. Check native Capacitor/WebView plugin if available
    if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Camera?.checkPermissions) {
      try {
        const capStatus = await window.Capacitor.Plugins.Camera.checkPermissions();
        if (capStatus?.camera === 'granted') return 'granted';
        if (capStatus?.camera === 'denied') return 'denied';
        if (capStatus?.camera === 'prompt' || capStatus?.camera === 'prompt-with-rationale') return 'prompt';
      } catch (e) {}
    }

    // 2. Query Permissions API if supported by browser
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      try {
        const perm = await navigator.permissions.query({ name: 'camera' });
        if (perm?.state) {
          // Listen for system permission changes
          perm.onchange = () => {
            try {
              if (perm.state === 'granted') {
                localStorage.setItem('vlive_camera_permission_granted', 'true');
              } else if (perm.state === 'denied') {
                localStorage.removeItem('vlive_camera_permission_granted');
              }
            } catch (e) {}
          };
          if (perm.state === 'granted') {
            try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
            return 'granted';
          }
          if (perm.state === 'denied') {
            try { localStorage.removeItem('vlive_camera_permission_granted'); } catch(e) {}
            return 'denied';
          }
          return 'prompt';
        }
      } catch (e) {
        // Some browsers (e.g. Firefox/Safari) may not support { name: 'camera' } in permissions.query
      }
    }

    // 3. Check enumerateDevices - if user previously granted, device labels are exposed!
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        if (videoDevices.length > 0 && videoDevices.some(d => Boolean(d.label && d.label.trim()))) {
          try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
          return 'granted';
        }
      } catch (e) {}
    }

    // Do NOT blindly trust localStorage if real device query has no labels (avoids false-positive permissions)
    return 'prompt';
  }

  /**
   * Checks the actual microphone permission state without triggering prompt
   * Returns 'granted' | 'denied' | 'prompt'
   */
  async checkMicPermission() {
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      try {
        const perm = await navigator.permissions.query({ name: 'microphone' });
        if (perm?.state) {
          if (perm.state === 'granted') {
            try { localStorage.setItem('vlive_mic_permission_granted', 'true'); } catch(e) {}
            return 'granted';
          }
          if (perm.state === 'denied') {
            try { localStorage.removeItem('vlive_mic_permission_granted'); } catch(e) {}
            return 'denied';
          }
          return 'prompt';
        }
      } catch (e) {}
    }

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(d => d.kind === 'audioinput');
        if (audioDevices.length > 0 && audioDevices.some(d => Boolean(d.label && d.label.trim()))) {
          try { localStorage.setItem('vlive_mic_permission_granted', 'true'); } catch(e) {}
          return 'granted';
        }
      } catch (e) {}
    }

    return 'prompt';
  }

  /**
   * Requests camera permission only if not already granted.
   * If already granted, does not call getUserMedia.
   */
  async requestCameraPermission() {
    const currentState = await this.checkCameraPermission();
    if (currentState === 'granted') {
      return 'granted';
    }
    if (currentState === 'denied') {
      const deniedErr = new Error('CAMERA_PERMISSION_DENIED');
      deniedErr.name = 'NotAllowedError';
      throw deniedErr;
    }

    // Request permission once by opening stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      this.activeStream = stream;
      try {
        localStorage.setItem('vlive_camera_permission_granted', 'true');
      } catch (e) {}
      return 'granted';
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        try { localStorage.removeItem('vlive_camera_permission_granted'); } catch(e) {}
        return 'denied';
      }
      throw err;
    }
  }

  /**
   * Ensures permissions for video and/or audio.
   * Only prompts if permissions are NOT already granted.
   * Never loops or prompts if state is already 'denied'.
   */
  async ensurePermissions({ video = true, audio = true } = {}) {
    const camState = video ? await this.checkCameraPermission() : 'granted';
    const micState = audio ? await this.checkMicPermission() : 'granted';

    if (camState === 'denied' || micState === 'denied') {
      const deniedKind = camState === 'denied' && micState === 'denied' ? 'CAMERA_AND_MIC' : (camState === 'denied' ? 'CAMERA' : 'MIC');
      const deniedErr = new Error(`PERMISSION_DENIED_${deniedKind}`);
      deniedErr.name = 'NotAllowedError';
      throw deniedErr;
    }

    if (camState === 'granted' && micState === 'granted') {
      return { camera: 'granted', microphone: 'granted' };
    }

    // Only invoke getUserMedia once when actual permission is pending ('prompt')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video && camState !== 'granted',
        audio: audio && micState !== 'granted'
      });

      if (video) {
        try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
      }
      if (audio) {
        try { localStorage.setItem('vlive_mic_permission_granted', 'true'); } catch(e) {}
      }

      this.activeStream = stream;
      return { camera: 'granted', microphone: 'granted' };
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        if (video) try { localStorage.removeItem('vlive_camera_permission_granted'); } catch(e) {}
        if (audio) try { localStorage.removeItem('vlive_mic_permission_granted'); } catch(e) {}
      }
      throw err;
    }
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
   * Direct getUserMedia - acquires camera & audio stream
   * Checks for existing live stream before requesting hardware
   * Does NOT loop or prompt repeatedly if user denied permission
   */
  async getUserMedia(constraints = { video: true, audio: true }, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    // Fast-path: Reuse active stream if tracks are live
    if (this.activeStream && this.activeStream.active) {
      const vTracks = this.activeStream.getVideoTracks();
      const aTracks = this.activeStream.getAudioTracks();
      const hasLiveVideo = !constraints.video || vTracks.some(t => t.readyState === 'live');
      const hasLiveAudio = !constraints.audio || aTracks.some(t => t.readyState === 'live');

      if (hasLiveVideo && hasLiveAudio) {
        return this.activeStream;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.activeStream = stream;
      try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
      if (constraints.audio) {
        try { localStorage.setItem('vlive_mic_permission_granted', 'true'); } catch(e) {}
      }
      return stream;
    } catch (err) {
      // If permission is denied by user or system, do NOT loop or retry!
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        try { localStorage.removeItem('vlive_camera_permission_granted'); } catch(e) {}
        try { localStorage.removeItem('vlive_mic_permission_granted'); } catch(e) {}
        throw err;
      }

      // Fallback with basic constraints ONLY for hardware resolution/constraint incompatibility
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: typeof constraints.video === 'object' && constraints.video?.facingMode ? { facingMode: constraints.video.facingMode } : true,
          audio: Boolean(constraints.audio)
        });
        this.activeStream = fallbackStream;
        try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
        return fallbackStream;
      } catch (fallbackErr) {
        if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
          throw fallbackErr;
        }
        const minimalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.activeStream = minimalStream;
        try { localStorage.setItem('vlive_camera_permission_granted', 'true'); } catch(e) {}
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
