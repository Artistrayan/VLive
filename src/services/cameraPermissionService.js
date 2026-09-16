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
    // If permissions are already granted at browser level or stored in session storage, return immediately
    const camState = await this.checkCameraPermission();
    const micState = await this.checkMicPermission();
    const storedCam = typeof window !== 'undefined' && window.safeStorage ? window.safeStorage.getItem('vlive_camera_permission_granted') === 'true' : false;
    const storedMic = typeof window !== 'undefined' && window.safeStorage ? window.safeStorage.getItem('vlive_mic_permission_granted') === 'true' : false;

    if ((!video || camState === 'granted' || storedCam) && (!audio || micState === 'granted' || storedMic)) {
      this.permissionState.camera = 'granted';
      this.permissionState.microphone = 'granted';
      return { camera: 'granted', microphone: 'granted' };
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

    // 1. Enumerate available video inputs
    let videoDevs = [];
    let currentDeviceId = null;
    if (oldTrack && typeof oldTrack.getSettings === 'function') {
      try {
        currentDeviceId = oldTrack.getSettings()?.deviceId || null;
      } catch (e) {}
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevs = devices.filter(d => d.kind === 'videoinput');
    } catch (e) {
      console.warn('[CameraPermission] Device enumeration error:', e);
    }

    // Single physical camera check
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

    // 2. Identify candidate device for target facingMode
    let targetDeviceId = null;
    if (videoDevs.length > 1) {
      const matchedDevice = videoDevs.find(d => {
        const label = (d.label || '').toLowerCase();
        if (facingMode === 'environment') {
          return label.includes('back') || label.includes('rear') || label.includes('environment') || 
                 label.includes('camera2 0') || label.includes('0, facing back') || label.includes('main') || label.includes('wide');
        } else {
          return label.includes('front') || label.includes('user') || label.includes('face') || 
                 label.includes('camera2 1') || label.includes('1, facing front') || label.includes('selfie');
        }
      });

      if (matchedDevice && matchedDevice.deviceId) {
        targetDeviceId = matchedDevice.deviceId;
      } else if (currentDeviceId) {
        const otherDev = videoDevs.find(d => d.deviceId && d.deviceId !== currentDeviceId);
        if (otherDev) {
          targetDeviceId = otherDev.deviceId;
        }
      } else if (videoDevs.length >= 2) {
        targetDeviceId = facingMode === 'environment' ? videoDevs[0].deviceId : videoDevs[1].deviceId;
      }
    }

    // 3. STOP previous video tracks so mobile camera driver releases the hardware
    if (oldTrack && typeof oldTrack.stop === 'function') {
      try { oldTrack.stop(); } catch (e) {}
    }
    if (this.activeStream) {
      try {
        this.activeStream.getVideoTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      } catch (e) {}
    }

    // 4. Acquire the target camera
    let newStream = null;

    // Attempt A: By exact targetDeviceId if identified
    if (targetDeviceId) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            deviceId: { exact: targetDeviceId }, 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          },
          audio: false
        });
      } catch (devErr) {
        console.warn('[CameraPermission] targetDeviceId failed, fallback to facingMode:', devErr);
      }
    }

    // Attempt B: By facingMode exact / ideal
    if (!newStream) {
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
        console.warn('[CameraPermission] facingMode ideal failed, fallback to direct string:', facingErr);
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false
        });
      }
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
      this.permissionState.camera = 'granted';

      // Persist granted permission permanently in safeStorage
      try {
        if (typeof window !== 'undefined' && window.safeStorage) {
          window.safeStorage.setItem('vlive_camera_permission_granted', 'true');
          window.safeStorage.setItem('vlive_permissions_granted', 'true');
        }
      } catch (e) {}

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
