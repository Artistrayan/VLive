class CameraPermissionService {
  constructor() {
    this.activeStream = null;
    this.currentFacingMode = 'user';
    this.permissionState = { camera: null, microphone: null };
  }

  async checkCameraPermission() {
    return "granted";
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

  async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      this.permissionState.camera = 'granted';
      return 'granted';
    } catch (err) {
      this.permissionState.camera = 'denied';
      return 'denied';
    }
  }

  async ensurePermissions({ video = true, audio = true } = {}) {
    const result = { camera: 'granted', microphone: 'granted' };
    try {
      const constraints = {};
      if (video) constraints.video = true;
      if (audio) constraints.audio = true;
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach(t => t.stop());
      
      if (video) this.permissionState.camera = 'granted';
      if (audio) this.permissionState.microphone = 'granted';
    } catch (err) {
      if (video) {
        result.camera = 'denied';
        this.permissionState.camera = 'denied';
      }
      if (audio) {
        result.microphone = 'denied';
        this.permissionState.microphone = 'denied';
      }
      throw new Error('Permission denied for camera/microphone');
    }
    return result;
  }

  async getVideoTrackForFacingMode(facingMode = 'user', oldTrack = null, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    let newStream = null;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
    } catch (err1) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false });
      } catch (err2) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
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
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
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
