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

    let targetDeviceId = null;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(d => d.kind === 'videoinput');
      
      if (videoDevs.length > 1) {
        // 1. Find device by label keyword
        const match = videoDevs.find(d => {
          const label = (d.label || '').toLowerCase();
          if (facingMode === 'environment') {
            return label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('facing back') || label.includes('camera2 0') || label.includes('0, facing back');
          } else {
            return label.includes('front') || label.includes('user') || label.includes('face') || label.includes('facing front') || label.includes('camera2 1') || label.includes('1, facing front');
          }
        });
        
        if (match) {
          targetDeviceId = match.deviceId;
        } else if (oldTrack && typeof oldTrack.getSettings === 'function') {
          // 2. If no labeled match, switch to the other available videoinput device
          const currDevId = oldTrack.getSettings()?.deviceId;
          const otherDev = videoDevs.find(d => d.deviceId && d.deviceId !== currDevId);
          if (otherDev) {
            targetDeviceId = otherDev.deviceId;
          }
        }
      }
    } catch (e) {
      console.warn('[CameraPermission] Device enumeration error:', e);
    }

    let newStream = null;

    // Strategy 1: If targetDeviceId found, request by deviceId
    if (targetDeviceId) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e1) {
        console.warn('[CameraPermission] targetDeviceId exact failed, trying facingMode:', e1);
      }
    }

    // Strategy 2: Request by exact facingMode
    if (!newStream) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e2) {
        console.warn('[CameraPermission] exact facingMode failed, trying ideal facingMode:', e2);
      }
    }

    // Strategy 3: Request by ideal facingMode
    if (!newStream) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e3) {
        console.warn('[CameraPermission] ideal facingMode failed, fallback to video: true:', e3);
      }
    }

    // Strategy 4: Fallback generic video
    if (!newStream) {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
    }

    const newTrack = newStream?.getVideoTracks()[0];
    if (newTrack && newTrack.readyState === 'live') {
      this.activeStream = newStream;
      return { track: newTrack, isNewTrack: true, stream: newStream };
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
