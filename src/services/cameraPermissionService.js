import { safeStorage } from '../utils/safeStorage';

class CameraPermissionService {
  constructor() {
    this.activeStream = null;
    this.currentFacingMode = 'user';
    this.permissionRequestPromise = null;
  }

  /**
   * Check if camera permission is already granted.
   */
  async checkCameraPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return 'prompt';
    }
    
    // Fast path: if we have an active stream, permission is granted
    if (this.activeStream && this.activeStream.active && this.activeStream.getVideoTracks().some(t => t.readyState === 'live')) {
      return 'granted';
    }

    // Secondary path: check local storage caching to avoid repeated loops
    try {
      const cachedStatus = safeStorage.getItem('vlive_camera_permission_granted') || localStorage.getItem('vlive_camera_permission_granted');
      if (cachedStatus === 'true') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        
        // If we see devices with real labels, the browser has already granted permission.
        if (videoDevices.length > 0 && videoDevices.some(d => Boolean(d.label && d.label.trim()))) {
          return 'granted';
        }
      }
    } catch (e) {}
    
    return 'prompt';
  }

  /**
   * Check if mic permission is already granted.
   */
  async checkMicPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return 'prompt';
    }
    
    // Fast path: if we have an active stream, permission is granted
    if (this.activeStream && this.activeStream.active && this.activeStream.getAudioTracks().some(t => t.readyState === 'live')) {
      return 'granted';
    }

    try {
      const cachedStatus = safeStorage.getItem('vlive_mic_permission_granted') || localStorage.getItem('vlive_mic_permission_granted');
      if (cachedStatus === 'true') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(d => d.kind === 'audioinput');
        if (audioDevices.length > 0 && audioDevices.some(d => Boolean(d.label && d.label.trim()))) {
          return 'granted';
        }
      }
    } catch (e) {}
    
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

    if (this.permissionRequestPromise) return this.permissionRequestPromise;

    this.permissionRequestPromise = (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.activeStream = stream;
        try {
          safeStorage.setItem('vlive_camera_permission_granted', 'true');
          localStorage.setItem('vlive_camera_permission_granted', 'true');
        } catch (e) {}
        return 'granted';
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          try { 
            safeStorage.removeItem('vlive_camera_permission_granted');
            localStorage.removeItem('vlive_camera_permission_granted');
          } catch(e) {}
          return 'denied';
        }
        throw err;
      } finally {
        this.permissionRequestPromise = null;
      }
    })();
    return this.permissionRequestPromise;
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

    if (this.permissionRequestPromise) return this.permissionRequestPromise;

    this.permissionRequestPromise = (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: video && camState !== 'granted',
          audio: audio && micState !== 'granted'
        });
        if (video) {
          try { 
            safeStorage.setItem('vlive_camera_permission_granted', 'true');
            localStorage.setItem('vlive_camera_permission_granted', 'true');
          } catch(e) {}
        }
        if (audio) {
          try { 
            safeStorage.setItem('vlive_mic_permission_granted', 'true');
            localStorage.setItem('vlive_mic_permission_granted', 'true');
          } catch(e) {}
        }
        this.activeStream = stream;
        return { camera: 'granted', microphone: 'granted' };
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          if (video) {
            try { 
              safeStorage.removeItem('vlive_camera_permission_granted');
              localStorage.removeItem('vlive_camera_permission_granted'); 
            } catch(e) {}
          }
          if (audio) {
            try { 
              safeStorage.removeItem('vlive_mic_permission_granted');
              localStorage.removeItem('vlive_mic_permission_granted'); 
            } catch(e) {}
          }
        }
        throw err;
      } finally {
        this.permissionRequestPromise = null;
      }
    })();
    return this.permissionRequestPromise;
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

    if (this.permissionRequestPromise) await this.permissionRequestPromise;

    // STEP 2: Directly acquire new stream with target facingMode
    this.permissionRequestPromise = (async () => {
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
        if (err1.name === 'NotAllowedError' || err1.name === 'PermissionDeniedError') {
          throw err1;
        }
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false
          });
          newTrack = newStream.getVideoTracks()[0];
        } catch (err2) {
          if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
            throw err2;
          }
          newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          newTrack = newStream.getVideoTracks()[0];
        }
      }
      return { track: newTrack, stream: newStream };
    })().finally(() => {
      this.permissionRequestPromise = null;
    });

    const { track: newTrack, stream: newStream } = await this.permissionRequestPromise;

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

    if (this.permissionRequestPromise) return this.permissionRequestPromise;

    this.permissionRequestPromise = (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.activeStream = stream;
        try { 
          if (constraints.video) {
            safeStorage.setItem('vlive_camera_permission_granted', 'true');
            localStorage.setItem('vlive_camera_permission_granted', 'true');
          }
          if (constraints.audio) {
            safeStorage.setItem('vlive_mic_permission_granted', 'true');
            localStorage.setItem('vlive_mic_permission_granted', 'true');
          }
        } catch(e) {}
        return stream;
      } catch (err) {
        // If permission is denied by user or system, do NOT loop or retry!
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          try { 
            safeStorage.removeItem('vlive_camera_permission_granted');
            localStorage.removeItem('vlive_camera_permission_granted');
            safeStorage.removeItem('vlive_mic_permission_granted');
            localStorage.removeItem('vlive_mic_permission_granted');
          } catch(e) {}
          throw err;
        }
        
        throw err; // DO NOT RETRY IF THERE IS AN ERROR! SINGLE FLIGHT!
      } finally {
        this.permissionRequestPromise = null;
      }
    })();

    return this.permissionRequestPromise;
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
