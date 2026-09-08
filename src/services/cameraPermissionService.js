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
   */
  async getVideoTrackForFacingMode(facingMode = 'user') {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    try {
      // Step 1: Enumerate devices to find the exact target camera ID to prevent OverconstrainedError and repeat prompts
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      
      let targetDeviceId = null;
      if (videoDevices.length > 1) {
        if (facingMode === 'environment') {
          const backCam = videoDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment'));
          if (backCam) targetDeviceId = backCam.deviceId;
          else targetDeviceId = videoDevices[videoDevices.length - 1].deviceId; // Guess last is back
        } else {
          const frontCam = videoDevices.find(d => d.label.toLowerCase().includes('front') || d.label.toLowerCase().includes('user') || d.label.toLowerCase().includes('selfie') || d.label.toLowerCase().includes('face'));
          if (frontCam) targetDeviceId = frontCam.deviceId;
          else targetDeviceId = videoDevices[0].deviceId;
        }
      }

      // Step 2: Use exact deviceId if found, otherwise fallback to generic facingMode
      const constraints = {
        video: targetDeviceId ? { deviceId: { exact: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const track = stream.getVideoTracks()[0];
      if (track) return { track, stream };
    } catch (e1) {
      console.warn('Failed with strict constraints, attempting generic fallback...', e1);
      
      // Fallback generic video if the strict request fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        return { track: fallbackStream.getVideoTracks()[0], stream: fallbackStream };
      } catch(e2) {
        console.error('All camera requests failed', e2);
        throw e2;
      }
    }
    return { track: null, stream: null };
  }

  /**
   * Safe getUserMedia wrapper that respects permission status and fetches requested hardware
   */
  async getUserMedia(constraints = { video: true, audio: true }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    const reqVideo = Boolean(constraints.video);
    const reqAudio = Boolean(constraints.audio);

    // If explicit facingMode is requested, use dedicated facingMode resolution
    if (reqVideo && typeof constraints.video === 'object' && constraints.video.facingMode) {
      const targetFacing = typeof constraints.video.facingMode === 'string' 
        ? constraints.video.facingMode 
        : (constraints.video.facingMode.exact || constraints.video.facingMode.ideal || 'user');
      
      const { track, stream } = await this.getVideoTrackForFacingMode(targetFacing);
      
      if (reqAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const audioTrack = audioStream.getAudioTracks()[0];
          if (audioTrack) stream.addTrack(audioTrack);
        } catch (aErr) {}
      }

      this.activeStream = stream;
      this.cameraPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
      return stream;
    }

    // Standard getUserMedia invocation
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.cameraPermissionState = 'granted';
      if (reqAudio) this.micPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      safeStorage.setItem('vlive_permissions_granted', 'true');
      this.activeStream = stream;
      return stream;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.cameraPermissionState = 'denied';
        safeStorage.setItem('vlive_camera_permission_granted', 'false');
        throw err;
      }
      // Fallback for WebView / Android explicit constraint issues
      const fallbackStream = await navigator.mediaDevices.getUserMedia({
        video: reqVideo ? true : false,
        audio: reqAudio ? true : false
      });
      this.activeStream = fallbackStream;
      this.cameraPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
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
