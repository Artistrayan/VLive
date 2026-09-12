import React from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export default function DevicePreviewFrame({ children }) {
  const { isEditMode, devicePreview, setDevicePreview } = useVisualUiEditor();

  if (!isEditMode || devicePreview === 'desktop') {
    return <>{children}</>;
  }

  let widthStyle = '100%';
  let frameTitle = 'Responsive Canvas';

  if (devicePreview === 'mobile') {
    widthStyle = '375px';
    frameTitle = 'Android Mobile (375px)';
  } else if (devicePreview === 'small_phone') {
    widthStyle = '320px';
    frameTitle = 'Small Phone (320px)';
  } else if (devicePreview === 'large_phone') {
    widthStyle = '430px';
    frameTitle = 'Large Phone (430px)';
  } else if (devicePreview === 'tablet') {
    widthStyle = '768px';
    frameTitle = 'Tablet Frame (768px)';
  }

  return (
    <div className="min-h-screen bg-slate-950 p-2 sm:p-6 flex flex-col items-center justify-start transition-all duration-300 dir-ltr">
      {/* DEVICE FRAME CONTAINER */}
      <div 
        className="relative bg-slate-900 border-4 border-amber-500/60 rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 my-4 flex flex-col"
        style={{ width: widthStyle, maxWidth: '100%', minHeight: '85vh' }}
      >
        {/* EMULATED TOP BAR / NOTCH */}
        <div className="bg-slate-950 border-b border-slate-800 py-1.5 px-4 flex items-center justify-between text-[10px] text-amber-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{frameTitle}</span>
          </div>
          <button
            onClick={() => setDevicePreview('desktop')}
            className="text-slate-400 hover:text-white"
          >
            ✕ Exit Frame
          </button>
        </div>

        {/* DEVICE CONTENT INNER AREA */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
