const fs = require('fs');
let content = fs.readFileSync('src/components/LiveStudioModal.jsx', 'utf8');

// Add startInProgressRef and startFailureReason
content = content.replace(
  'const isSwitchingCameraRef = useRef(false);',
  'const isSwitchingCameraRef = useRef(false);\n  const startInProgressRef = useRef(false);\n  const [startFailureReason, setStartFailureReason] = useState("");'
);

// Update handleInitiateStart
const handleInitiateStartOld = `  const handleInitiateStart = () => {
    // Trigger Countdown
    setStudioPhase('COUNTDOWN');
    let currentCount = 3;
    setCountdownNum(3);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
      } else {
        clearInterval(interval);
        setCountdownNum(0);
        executeLiveStart();
      }
    }, 1000);
  };`;
const handleInitiateStartNew = `  const handleInitiateStart = () => {
    if (startInProgressRef.current) return;
    startInProgressRef.current = true;
    setStartFailureReason('');
    setStudioPhase('COUNTDOWN');
    let currentCount = 3;
    setCountdownNum(3);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
      } else {
        clearInterval(interval);
        setCountdownNum(0);
        executeLiveStart();
      }
    }, 1000);
  };`;
content = content.replace(handleInitiateStartOld, handleInitiateStartNew);

// Update executeLiveStart's catch block
const catchOld = `    } catch (globalErr) {
      console.error('executeLiveStart error:', globalErr);
      setStudioPhase('PRE_LIVE');
      setIsStartingLive(false);
      showToast(globalErr.message);
    }`;
const catchNew = `    } catch (globalErr) {
      console.error('executeLiveStart error:', globalErr);
      setStartFailureReason(globalErr.message || 'خطا در شروع لایو');
      setStudioPhase('START_FAILED');
      setIsStartingLive(false);
      startInProgressRef.current = false;
    }`;
content = content.replace(catchOld, catchNew);

// Also reset startInProgressRef on end live
content = content.replace(
  'const handleEndLiveStream = async () => {',
  'const handleEndLiveStream = async () => {\n    startInProgressRef.current = false;'
);

// Add START_FAILED phase UI
const failedPhase = `      {/* PHASE: START FAILED */}
      {studioPhase === 'START_FAILED' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md space-y-6 animate-fadeIn relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
            <AlertTriangle className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">{window.loc('شروع اجرای زنده انجام نشد', 'Live Start Failed')}</h2>
          <p className="text-slate-300 max-w-sm text-center leading-relaxed">
            {startFailureReason}
          </p>
          <div className="pt-6">
            <button 
               onClick={() => {
                  startInProgressRef.current = false;
                  setStudioPhase('PRE_LIVE');
                  initCameraAndStream();
               }}
               className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-500/30 transition-all active:scale-95"
            >
              {window.loc('تلاش مجدد (بازگشت)', 'Retry (Back)')}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: LIVE STUDIO BROADCAST SCREEN */}`;

content = content.replace('      {/* PHASE 3: LIVE STUDIO BROADCAST SCREEN */}', failedPhase);

fs.writeFileSync('src/components/LiveStudioModal.jsx', content);
