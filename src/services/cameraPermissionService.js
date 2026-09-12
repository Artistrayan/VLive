import { safeStorage } from '../utils/safeStorage';

class CameraPermissionService {
  constructor() {
    this.cameraPermissionState = null; // 'granted' | 'denied' | 'prompt' | null
    this.micPermissionState = null;
    this.permissionRequestPromise = null;
    this.activeStream = null;
    this.currentFacingMode = 'user';

    // Load initial cached permission state - once granted, always keep as granted
    if (
      safeStorage.getItem('vlive_camera_permission_granted') === 'true' || 
      safeStorage.getItem('vlive_permissions_granted') === 'true'
    ) {
      this.cameraPermissionState = 'granted';
    }
    if (
      safeStorage.getItem('vlive_mic_permission_granted') === 'true' || 
      safeStorage.getItem('vlive_permissions_granted') === 'true'
    ) {
      this.micPermissionState = 'granted';
    }
  }

  /**
   * Check current Camera permission status
   * Returns: 'granted' | 'denied' | 'prompt'
   */
  async checkCameraPermission() {
    // If in-memory state or storage is already granted, return immediately
    if (
      this.cameraPermissionState === 'granted' || 
      safeStorage.getItem('vlive_camera_permission_granted') === 'true' || 
      safeStorage.getItem('vlive_permissions_granted') === 'true'
    ) {
      this.cameraPermissionState = 'granted';
      return 'granted';
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'camera' });
        this.cameraPermissionState = status.state;
        if (status.state === 'granted') {
          safeStorage.setItem('vlive_camera_permission_granted', 'true');
          safeStorage.setItem('vlive_permissions_granted', 'true');
        }
        status.onchange = () => {
          this.cameraPermissionState = status.state;
          if (status.state === 'granted') {
            safeStorage.setItem('vlive_camera_permission_granted', 'true');
            safeStorage.setItem('vlive_permissions_granted', 'true');
          }
        };
        return status.state;
      } catch (e) {
        // Fallback
      }
    }

    return this.cameraPermissionState || 'granted';
  }

  /**
   * Check Microphone permission status
   */
  async checkMicPermission() {
    if (
      this.micPermissionState === 'granted' || 
      safeStorage.getItem('vlive_mic_permission_granted') === 'true' || 
      safeStorage.getItem('vlive_permissions_granted') === 'true'
    ) {
      this.micPermissionState = 'granted';
      return 'granted';
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        this.micPermissionState = status.state;
        if (status.state === 'granted') {
          safeStorage.setItem('vlive_mic_permission_granted', 'true');
          safeStorage.setItem('vlive_permissions_granted', 'true');
        }
        return status.state;
      } catch (e) {}
    }

    return this.micPermissionState || 'granted';
  }

  /**
   * Request Camera / Mic permissions with lock to avoid duplicate concurrent prompts
   */
  async ensurePermissions({ video = true, audio = true } = {}) {
    const currentCam = video ? await this.checkCameraPermission() : 'granted';
    const currentMic = audio ? await this.checkMicPermission() : 'granted';

    // If both are already GRANTED, NEVER request permissions again
    if (currentCam === 'granted' && currentMic === 'granted') {
      return { camera: 'granted', microphone: 'granted' };
    }

    if (this.permissionRequestPromise) {
      return this.permissionRequestPromise;
    }

    this.permissionRequestPromise = (async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MEDIA_NOT_SUPPORTED');
        }

        const tempStream = await navigator.mediaDevices.getUserMedia({ video, audio });

        this.cameraPermissionState = 'granted';
        this.micPermissionState = 'granted';
        safeStorage.setItem('vlive_permissions_granted', 'true');
        safeStorage.setItem('vlive_camera_permission_granted', 'true');
        safeStorage.setItem('vlive_mic_permission_granted', 'true');
        safeStorage.setItem('vlive_permissions_prompted_once', 'true');

        if (tempStream && tempStream.active) {
          this.activeStream = tempStream;
        }

        return { camera: 'granted', microphone: 'granted', stream: tempStream };
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.cameraPermissionState = 'denied';
          this.micPermissionState = 'denied';
          safeStorage.setItem('vlive_camera_permission_granted', 'false');
          safeStorage.setItem('vlive_mic_permission_granted', 'false');
          return { camera: 'denied', microphone: 'denied', denied: true, error: err };
        }
        // If other error (device busy etc.), assume granted so UI doesn't lock up
        this.cameraPermissionState = 'granted';
        return { camera: 'granted', microphone: 'granted' };
      } finally {
        this.permissionRequestPromise = null;
      }
    })();

    return this.permissionRequestPromise;
  }

  /**
   * Acquire a fresh video track with the specific facing mode (user vs environment)
   * Prevents repeated Telegram WebView permission prompts by:
   * 1. Trying applyConstraints directly on the existing live track
   * 2. Acquiring the new track BEFORE stopping the old track (never drops to 0 active tracks)
   * 3. Single clean atomic getUserMedia without throwing OverconstrainedError
   */
  async getVideoTrackForFacingMode(facingMode = 'user', oldTrack = null) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    // STEP 1: Attempt seamless in-place constraint switch on the existing track if possible
    if (oldTrack && oldTrack.readyState === 'live' && typeof oldTrack.applyConstraints === 'function') {
      try {
        await oldTrack.applyConstraints({
          facingMode: { ideal: facingMode }
        });
        const currentSettings = typeof oldTrack.getSettings === 'function' ? oldTrack.getSettings() : {};
        if (currentSettings.facingMode === facingMode) {
          return { track: oldTrack, stream: null };
        }
      } catch (applyErr) {
        // applyConstraints not supported on this platform/browser, continue to atomic acquisition
      }
    }

    // STEP 2: Atomic acquisition of the new camera track BEFORE stopping the old track
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
    } catch (idealErr) {
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false
        });
        newTrack = newStream.getVideoTracks()[0];
      } catch (fallbackErr) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        newTrack = newStream.getVideoTracks()[0];
      }
    }

    // STEP 3: Now that the new sensor is active and streaming, safely release the old track
    if (oldTrack && newTrack && oldTrack !== newTrack) {
      try {
        oldTrack.stop();
      } catch (e) {}
    }

    if (newTrack) {
      this.cameraPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
      return { track: newTrack, stream: newStream };
    }
    return { track: oldTrack, stream: null };
  }

  /**
   * Safe getUserMedia wrapper that requests hardware atomically (NO separate prompts)
   */
  async getUserMedia(constraints = { video: true, audio: true }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    const reqVideo = Boolean(constraints.video);
    const reqAudio = Boolean(constraints.audio);

    // Atomic request: Always request video & audio in a SINGLE call if both are requested
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.cameraPermissionState = 'granted';
      if (reqAudio) this.micPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_mic_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
      this.activeStream = stream;
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.cameraPermissionState = 'denied';
        safeStorage.setItem('vlive_camera_permission_granted', 'false');
        throw err;
      }
      
      console.warn('getUserMedia strict constraints fallback:', err);
      // Fallback with relaxed constraints in a single atomic call
      const fallbackStream = await navigator.mediaDevices.getUserMedia({
        video: reqVideo ? true : false,
        audio: reqAudio ? true : false
      });
      this.activeStream = fallbackStream;
      this.cameraPermissionState = 'granted';
      if (reqAudio) this.micPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_mic_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
      return fallbackStream;
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
   * Set active stream (e.g. from external source)
   */
  setActiveStream(stream) {
    if (stream && stream.active) {
      this.activeStream = stream;
      this.cameraPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
    }
  }
}

export const cameraPermissionService = new CameraPermissionService();
export default cameraPermissionService;
