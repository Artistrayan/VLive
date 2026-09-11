import { safeStorage } from '../utils/safeStorage';

class CameraPermissionService {
  constructor() {
    this.cameraPermissionState = null; // 'granted' | 'denied' | 'prompt' | null
    this.micPermissionState = null;
    this.permissionRequestPromise = null;
    this.activeStream = null;
    this.currentFacingMode = 'user';
    this.operationCounter = 0;

    // Load independent cached permission state (never mix camera & microphone flags)
    const savedCam = safeStorage.getItem('vlive_camera_permission_state') || 
      (safeStorage.getItem('vlive_camera_permission_granted') === 'true' ? 'granted' : 
       safeStorage.getItem('vlive_camera_permission_granted') === 'false' ? 'denied' : null);
    if (savedCam) {
      this.cameraPermissionState = savedCam;
    }

    const savedMic = safeStorage.getItem('vlive_mic_permission_state') || 
      (safeStorage.getItem('vlive_mic_permission_granted') === 'true' ? 'granted' : 
       safeStorage.getItem('vlive_mic_permission_granted') === 'false' ? 'denied' : null);
    if (savedMic) {
      this.micPermissionState = savedMic;
    }
  }

  /**
   * Check current Camera permission status
   * Returns: 'granted' | 'denied' | 'prompt'
   */
  async checkCameraPermission() {
    if (this.cameraPermissionState === 'granted' || this.cameraPermissionState === 'denied') {
      return this.cameraPermissionState;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'camera' });
        this.cameraPermissionState = status.state;
        if (status.state === 'granted' || status.state === 'denied') {
          safeStorage.setItem('vlive_camera_permission_state', status.state);
          safeStorage.setItem('vlive_camera_permission_granted', status.state === 'granted' ? 'true' : 'false');
        }
        status.onchange = () => {
          this.cameraPermissionState = status.state;
          if (status.state === 'granted' || status.state === 'denied') {
            safeStorage.setItem('vlive_camera_permission_state', status.state);
            safeStorage.setItem('vlive_camera_permission_granted', status.state === 'granted' ? 'true' : 'false');
          }
        };
        return status.state;
      } catch (e) {
        // Permissions API for 'camera' may not be supported in all mobile WebViews
      }
    }

    return this.cameraPermissionState || 'prompt';
  }

  /**
   * Check Microphone permission status
   */
  async checkMicPermission() {
    if (this.micPermissionState === 'granted' || this.micPermissionState === 'denied') {
      return this.micPermissionState;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        this.micPermissionState = status.state;
        if (status.state === 'granted' || status.state === 'denied') {
          safeStorage.setItem('vlive_mic_permission_state', status.state);
          safeStorage.setItem('vlive_mic_permission_granted', status.state === 'granted' ? 'true' : 'false');
        }
        return status.state;
      } catch (e) {}
    }

    return this.micPermissionState || 'prompt';
  }

  /**
   * Request Camera permission specifically (isolated from microphone)
   */
  async requestCameraPermission(opId = 0) {
    if (this.cameraPermissionState === 'granted' && this.activeStream && this.activeStream.active) {
      return 'granted';
    }
    if (this.cameraPermissionState === 'denied') {
      return 'denied';
    }

    if (this.permissionRequestPromise) {
      return this.permissionRequestPromise;
    }

    this.permissionRequestPromise = (async () => {
      console.log(`[Camera:${opId}] CAMERA_PERMISSION_REQUEST single atomic request`);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('MEDIA_NOT_SUPPORTED');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: this.currentFacingMode || 'user' } },
          audio: true
        }).catch(async (audioErr) => {
          console.warn(`[Camera:${opId}] Combined video+audio permission failed (${audioErr.message}), trying video only`);
          return await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: this.currentFacingMode || 'user' } },
            audio: false
          });
        });

        this.cameraPermissionState = 'granted';
        safeStorage.setItem('vlive_camera_permission_state', 'granted');
        safeStorage.setItem('vlive_camera_permission_granted', 'true');
        if (stream.getAudioTracks().length > 0) {
          this.micPermissionState = 'granted';
          safeStorage.setItem('vlive_mic_permission_state', 'granted');
          safeStorage.setItem('vlive_mic_permission_granted', 'true');
        }

        this.activeStream = stream;
        console.log(`[Camera:${opId}] CAMERA_PERMISSION_REQUEST result: GRANTED, stream cached`);
        return 'granted';
      } catch (err) {
        console.warn(`[Camera:${opId}] CAMERA_PERMISSION_REQUEST error:`, err.name, err.message);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.cameraPermissionState = 'denied';
          safeStorage.setItem('vlive_camera_permission_state', 'denied');
          safeStorage.setItem('vlive_camera_permission_granted', 'false');
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
   * Request Camera / Mic permissions with lock to avoid duplicate concurrent prompts
   */
  async ensurePermissions({ video = true, audio = true } = {}) {
    const currentCam = video ? await this.checkCameraPermission() : 'granted';
    const currentMic = audio ? await this.checkMicPermission() : 'granted';

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

        if (video) {
          this.cameraPermissionState = 'granted';
          safeStorage.setItem('vlive_camera_permission_state', 'granted');
          safeStorage.setItem('vlive_camera_permission_granted', 'true');
        }
        if (audio) {
          this.micPermissionState = 'granted';
          safeStorage.setItem('vlive_mic_permission_state', 'granted');
          safeStorage.setItem('vlive_mic_permission_granted', 'true');
        }

        if (tempStream && tempStream.active) {
          this.activeStream = tempStream;
        }

        return { camera: 'granted', microphone: 'granted', stream: tempStream };
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          if (video) {
            this.cameraPermissionState = 'denied';
            safeStorage.setItem('vlive_camera_permission_state', 'denied');
            safeStorage.setItem('vlive_camera_permission_granted', 'false');
          }
          if (audio) {
            this.micPermissionState = 'denied';
            safeStorage.setItem('vlive_mic_permission_state', 'denied');
            safeStorage.setItem('vlive_mic_permission_granted', 'false');
          }
          return { camera: this.cameraPermissionState, microphone: this.micPermissionState, denied: true, error: err };
        }
        throw err;
      } finally {
        this.permissionRequestPromise = null;
      }
    })();

    return this.permissionRequestPromise;
  }

  /**
   * Acquire video track for facing mode (user vs environment)
   * Prevents black screen & permission loops by:
   * 1. Trying applyConstraints directly on existing live track first.
   * 2. If applyConstraints succeeds: returns same track with isNewTrack: false (caller MUST NOT stop it!).
   * 3. If applyConstraints fails: acquires new track and verifies it's live before returning (caller stops old track ONLY after attaching new one).
   */
  async getVideoTrackForFacingMode(facingMode = 'user', oldTrack = null, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported');
    }
    this.currentFacingMode = facingMode;

    // STEP 1: Attempt seamless in-place constraint switch on the existing track if possible
    if (oldTrack && oldTrack.readyState === 'live' && typeof oldTrack.applyConstraints === 'function') {
      try {
        console.log(`[Camera:${opId}] CAMERA_SWITCH_APPLY_CONSTRAINTS trying ideal: ${facingMode}`);
        await oldTrack.applyConstraints({
          facingMode: { ideal: facingMode }
        });
        const currentSettings = typeof oldTrack.getSettings === 'function' ? oldTrack.getSettings() : {};
        if (currentSettings.facingMode === facingMode) {
          console.log(`[Camera:${opId}] CAMERA_SWITCH_APPLY_CONSTRAINTS success on existing track`);
          return { track: oldTrack, isNewTrack: false, stream: null };
        }
      } catch (applyErr) {
        console.log(`[Camera:${opId}] applyConstraints not supported or failed (${applyErr.message}), switching via new stream`);
      }
    }

    // STEP 2: Atomic acquisition of the new camera track BEFORE stopping the old track
    console.log(`[Camera:${opId}] CAMERA_SWITCH_NEW_STREAM requesting facingMode: ${facingMode}`);
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
      console.warn(`[Camera:${opId}] ideal constraints failed, falling back to exact facingMode:`, idealErr.message);
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
          audio: false
        });
        newTrack = newStream.getVideoTracks()[0];
      } catch (fallbackErr) {
        console.warn(`[Camera:${opId}] facingMode fallback failed, falling back to basic video:`, fallbackErr.message);
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        newTrack = newStream.getVideoTracks()[0];
      }
    }

    if (newTrack && newTrack.readyState === 'live') {
      console.log(`[Camera:${opId}] CAMERA_TRACK_CREATED id=${newTrack.id}, readyState=${newTrack.readyState}`);
      this.cameraPermissionState = 'granted';
      safeStorage.setItem('vlive_camera_permission_state', 'granted');
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
      return { track: newTrack, isNewTrack: true, stream: newStream };
    }

    throw new Error('FAILED_TO_ACQUIRE_LIVE_CAMERA_TRACK');
  }

  /**
   * Safe getUserMedia wrapper that requests hardware atomically
   */
  async getUserMedia(constraints = { video: true, audio: true }, opId = 0) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC mediaDevices is not supported in this environment.');
    }

    const reqVideo = Boolean(constraints.video);
    const reqAudio = Boolean(constraints.audio);

    console.log(`[Camera:${opId}] CAMERA_STREAM_CREATE with constraints:`, JSON.stringify(constraints));

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (reqVideo) {
        this.cameraPermissionState = 'granted';
        safeStorage.setItem('vlive_camera_permission_state', 'granted');
        safeStorage.setItem('vlive_camera_permission_granted', 'true');
      }
      if (reqAudio) {
        this.micPermissionState = 'granted';
        safeStorage.setItem('vlive_mic_permission_state', 'granted');
        safeStorage.setItem('vlive_mic_permission_granted', 'true');
      }
      this.activeStream = stream;
      console.log(`[Camera:${opId}] CAMERA_STREAM_CREATED successfully`);
      return stream;
    } catch (err) {
      console.warn(`[Camera:${opId}] getUserMedia primary error:`, err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        if (reqVideo) {
          this.cameraPermissionState = 'denied';
          safeStorage.setItem('vlive_camera_permission_state', 'denied');
          safeStorage.setItem('vlive_camera_permission_granted', 'false');
        }
        if (reqAudio) {
          this.micPermissionState = 'denied';
          safeStorage.setItem('vlive_mic_permission_state', 'denied');
          safeStorage.setItem('vlive_mic_permission_granted', 'false');
        }
        throw err;
      }

      // Fallback with relaxed constraints
      if (reqVideo) {
        console.log(`[Camera:${opId}] Attempting relaxed constraints fallback`);
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: typeof constraints.video === 'object' && constraints.video.facingMode ? { facingMode: constraints.video.facingMode } : true,
            audio: reqAudio ? true : false
          });
          this.cameraPermissionState = 'granted';
          safeStorage.setItem('vlive_camera_permission_state', 'granted');
          safeStorage.setItem('vlive_camera_permission_granted', 'true');
          if (reqAudio) {
            this.micPermissionState = 'granted';
            safeStorage.setItem('vlive_mic_permission_state', 'granted');
            safeStorage.setItem('vlive_mic_permission_granted', 'true');
          }
          this.activeStream = fallbackStream;
          console.log(`[Camera:${opId}] CAMERA_STREAM_CREATED via relaxed fallback`);
          return fallbackStream;
        } catch (fallbackErr) {
          if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
            this.cameraPermissionState = 'denied';
            safeStorage.setItem('vlive_camera_permission_state', 'denied');
            safeStorage.setItem('vlive_camera_permission_granted', 'false');
          }
          throw fallbackErr;
        }
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
      safeStorage.setItem('vlive_camera_permission_state', 'granted');
      safeStorage.setItem('vlive_camera_permission_granted', 'true');
    }
  }
}

export const cameraPermissionService = new CameraPermissionService();
export default cameraPermissionService;
