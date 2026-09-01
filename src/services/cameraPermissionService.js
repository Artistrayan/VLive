import { safeStorage } from '../utils/safeStorage';

class CameraPermissionService {
  constructor() {
    this.cameraPermissionState = null; // 'granted' | 'denied' | 'prompt' | null
    this.micPermissionState = null;
    this.permissionRequestPromise = null;
    this.activeStream = null;

    // Load initial cached permission state
    if (safeStorage.getItem('vlive_camera_permission_granted') === 'true' || safeStorage.getItem('vlive_permissions_granted') === 'true') {
      this.cameraPermissionState = 'granted';
    }
    if (safeStorage.getItem('vlive_mic_permission_granted') === 'true' || safeStorage.getItem('vlive_permissions_granted') === 'true') {
      this.micPermissionState = 'granted';
    }
  }

  /**
   * Check current Camera permission status
   * Returns: 'granted' | 'denied' | 'prompt'
   */
  async checkCameraPermission() {
    // If in-memory state is already granted, return immediately
    if (this.cameraPermissionState === 'granted') {
      return 'granted';
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'camera' });
        this.cameraPermissionState = status.state;
        if (status.state === 'granted') {
          safeStorage.setItem('vlive_camera_permission_granted', 'true');
        }
        status.onchange = () => {
          this.cameraPermissionState = status.state;
          if (status.state === 'granted') {
            safeStorage.setItem('vlive_camera_permission_granted', 'true');
          }
        };
        return status.state;
      } catch (e) {
        // Fallback for browsers that don't support { name: 'camera' } in permissions.query
      }
    }

    if (safeStorage.getItem('vlive_camera_permission_granted') === 'true' || safeStorage.getItem('vlive_permissions_granted') === 'true') {
      this.cameraPermissionState = 'granted';
      return 'granted';
    }

    return this.cameraPermissionState || 'prompt';
  }

  /**
   * Check Microphone permission status
   */
  async checkMicPermission() {
    if (this.micPermissionState === 'granted') {
      return 'granted';
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        this.micPermissionState = status.state;
        if (status.state === 'granted') {
          safeStorage.setItem('vlive_mic_permission_granted', 'true');
        }
        return status.state;
      } catch (e) {}
    }

    if (safeStorage.getItem('vlive_mic_permission_granted') === 'true' || safeStorage.getItem('vlive_permissions_granted') === 'true') {
      this.micPermissionState = 'granted';
      return 'granted';
    }

    return this.micPermissionState || 'prompt';
  }

  /**
   * Request Camera / Mic permissions with lock to avoid duplicate concurrent prompts
   */
  async ensurePermissions({ video = true, audio = true } = {}) {
    const currentCam = video ? await this.checkCameraPermission() : 'granted';
    const currentMic = audio ? await this.checkMicPermission() : 'granted';

    // Rule 3: If both are already GRANTED, NEVER request permissions again!
    if (currentCam === 'granted' && currentMic === 'granted') {
      return { camera: 'granted', microphone: 'granted' };
    }

    // Rule: If explicitly denied, return denied state without prompting repeatedly
    if (currentCam === 'denied' || currentMic === 'denied') {
      return {
        camera: currentCam,
        microphone: currentMic,
        denied: true
      };
    }

    // Rule 4: Promise Lock to prevent duplicate concurrent prompts (e.g., Preview + Live)
    if (this.permissionRequestPromise) {
      return this.permissionRequestPromise;
    }

    this.permissionRequestPromise = (async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MEDIA_NOT_SUPPORTED');
        }

        // Single controlled getUserMedia call to request permission from browser/OS
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
        throw err;
      } finally {
        this.permissionRequestPromise = null;
      }
    })();

    return this.permissionRequestPromise;
  }

  /**
   * Safe getUserMedia wrapper that respects permission status and reuses active streams
   */
  async getUserMedia(constraints = { video: true, audio: true }) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    // Check if existing activeStream has live tracks that match request
    if (this.activeStream && this.activeStream.active) {
      const hasVideo = !constraints.video || this.activeStream.getVideoTracks().some(t => t.readyState === 'live');
      const hasAudio = !constraints.audio || this.activeStream.getAudioTracks().some(t => t.readyState === 'live');
      if (hasVideo && hasAudio) {
        return this.activeStream;
      }
    }

    const reqVideo = Boolean(constraints.video);
    const reqAudio = Boolean(constraints.audio);

    // Ensure permissions before invoking getUserMedia
    const permResult = await this.ensurePermissions({ video: reqVideo, audio: reqAudio });

    if (permResult.denied) {
      throw new Error('CAMERA_PERMISSION_DENIED');
    }

    if (permResult.stream && permResult.stream.active) {
      this.activeStream = permResult.stream;
      return permResult.stream;
    }

    // Permission is granted - invoke getUserMedia directly
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.cameraPermissionState = 'granted';
      if (reqAudio) this.micPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      this.activeStream = stream;
      return stream;
    } catch (err) {
      if (err.name !== 'NotAllowedError' && err.name !== 'PermissionDeniedError') {
        // Fallback for WebView / Android explicit constraint issues
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: reqVideo ? true : false,
          audio: reqAudio ? true : false
        });
        this.activeStream = fallbackStream;
        return fallbackStream;
      }
      throw err;
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
    }
  }
}

export const cameraPermissionService = new CameraPermissionService();
