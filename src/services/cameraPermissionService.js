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
    // If permissions are already granted at browser level, return immediately without opening camera
    const camState = await this.checkCameraPermission();
    const micState = await this.checkMicPermission();
    if ((!video || camState === 'granted') && (!audio || micState === 'granted')) {
      return { camera: camState, microphone: micState };
    }

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

    // 1. FAST-PATH: If oldTrack is alive and supports applyConstraints, use applyConstraints
    // This flips camera hardware instantly without ANY getUserMedia call or permission prompt!
    if (oldTrack && oldTrack.readyState === 'live' && typeof oldTrack.applyConstraints === 'function') {
      try {
        await oldTrack.applyConstraints({
          facingMode: { ideal: facingMode }
        });
        
        let actualFacingMode = facingMode;
        const settings = typeof oldTrack.getSettings === 'function' ? oldTrack.getSettings() : {};
        if (settings.facingMode) {
          actualFacingMode = settings.facingMode;
        } else if (oldTrack.label) {
          const label = oldTrack.label.toLowerCase();
          if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
            actualFacingMode = 'environment';
          } else if (label.includes('front') || label.includes('user') || label.includes('face')) {
            actualFacingMode = 'user';
          }
        }
        this.currentFacingMode = actualFacingMode;

        return {
          track: oldTrack,
          isNewTrack: false,
          stream: this.activeStream,
          actualFacingMode: actualFacingMode,
          isSingleCamera: false
        };
      } catch (applyErr) {
        console.log('[CameraPermission] applyConstraints not supported on this track, using seamless track switch:', applyErr);
      }
    }

    // 2. Enumerate available video inputs to check if physical camera exists
    let videoDevs = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevs = devices.filter(d => d.kind === 'videoinput');
    } catch (e) {
      console.warn('[CameraPermission] Device enumeration error:', e);
    }

    // If device physically only has 1 camera total
    if (videoDevs.length === 1 && oldTrack && oldTrack.readyState === 'live') {
      const settings = typeof oldTrack.getSettings === 'function' ? oldTrack.getSettings() : {};
      const actualFacing = settings.facingMode || 'user';
      return { 
        track: oldTrack, 
        isNewTrack: false, 
        isSingleCamera: true, 
        actualFacingMode: actualFacing,
        stream: this.activeStream 
      };
    }

    // 3. Clean acquisition without deviceId exact constraints
    // Request using facingMode: { ideal: facingMode } which NEVER asks for deviceId fingerprint permissions
    let newStream = null;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: facingMode }, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false
      });
    } catch (facingErr) {
      console.warn('[CameraPermission] ideal facingMode acquisition fallback:', facingErr.message);
      newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false
      });
    }

    // Stop old track ONLY after successfully acquiring new track
    if (oldTrack && typeof oldTrack.stop === 'function') {
      try { oldTrack.stop(); } catch (e) {}
    }

    const newTrack = newStream?.getVideoTracks()[0];
    if (newTrack && newTrack.readyState === 'live') {
      this.activeStream = newStream;

      let actualFacingMode = facingMode;
      const settings = typeof newTrack.getSettings === 'function' ? newTrack.getSettings() : {};
      if (settings.facingMode) {
        actualFacingMode = settings.facingMode;
      } else if (newTrack.label) {
        const label = newTrack.label.toLowerCase();
        if (label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('camera2 0') || label.includes('0, facing back')) {
          actualFacingMode = 'environment';
        } else if (label.includes('front') || label.includes('user') || label.includes('face') || label.includes('camera2 1') || label.includes('1, facing front')) {
          actualFacingMode = 'user';
        }
      }

      this.currentFacingMode = actualFacingMode;

      return { 
        track: newTrack, 
        isNewTrack: true, 
        stream: newStream,
        actualFacingMode: actualFacingMode,
        isSingleCamera: false
      };
    }

    throw new Error('FAILED_TO_ACQUIRE_CAMERA_TRACK');
  }

  async getUserMedia(constraints = { video: true, audio: true }, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    const requestedFacing = typeof constraints.video === 'object' && constraints.video !== null ? (constraints.video.facingMode?.ideal || constraints.video.facingMode) : null;

    // 1. If an existing stream already has all requested live tracks and facingMode matches, reuse it directly
    if (this.activeStream && this.activeStream.active && (!requestedFacing || requestedFacing === this.currentFacingMode)) {
      const vOk = !constraints.video || this.activeStream.getVideoTracks().some(t => t.readyState === 'live');
      const aOk = !constraints.audio || this.activeStream.getAudioTracks().some(t => t.readyState === 'live');
      if (vOk && aOk) {
        return this.activeStream;
      }

      // If we already have video and only need audio, request ONLY audio and attach to active stream
      if (vOk && !aOk && constraints.audio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const aTrack = audioStream.getAudioTracks()[0];
          if (aTrack) {
            this.activeStream.addTrack(aTrack);
            this.permissionState.microphone = 'granted';
            return this.activeStream;
          }
        } catch (e) {
          console.warn('[CameraPermission] Audio attachment skipped or not available');
          return this.activeStream;
        }
      }
    }

    // 2. Clean constraints to avoid OverconstrainedError and multiple prompt cascades
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
