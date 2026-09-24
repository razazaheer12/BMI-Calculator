import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Hide button if already installed as standalone PWA
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 3000);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (compact) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          title="Install App on Redmi 13C / Phone"
          aria-label="Install App"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700/80 active:scale-95 text-xs text-orange-400 font-medium border border-orange-500/20 transition-all shadow-sm"
        >
          {installedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Installed!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </>
          )}
        </button>

        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-semibold text-white">Install on Mobile / PC</h3>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-sm text-neutral-300">
                  <p>Safari browser mein install karne ke liye:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-neutral-400">
                    <li>Neeche Safari toolbar mein <strong className="text-white">Share</strong> button dabayein.</li>
                    <li>Neeche scroll karein aur <strong className="text-white">'Add to Home Screen'</strong> par click karein.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-neutral-300">
                  <p>Redmi 13C ya Android Chrome par install karne ke liye:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-neutral-400">
                    <li>Browser ke top right <strong>three dots (⋮)</strong> dabayein.</li>
                    <li><strong className="text-white">'Add to Home Screen'</strong> ya <strong className="text-white">'Install App'</strong> select karein.</li>
                    <li>Yeh app bina browser frame ke direct Redmi home screen par chalegi!</li>
                  </ol>
                </div>
              )}

              <button
                onClick={() => setShowGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
              >
                Theek Hai (Got it)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="px-4 py-2 bg-gradient-to-r from-orange-950/40 via-neutral-900 to-neutral-900 border-b border-orange-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-neutral-300">Redmi 13C par install karein</span>
        </div>
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-full shadow-sm active:scale-95 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Install
        </button>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-semibold text-white">Install on Mobile / PC</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-neutral-300">
              <p>Redmi 13C ya Android Chrome par install karne ke liye:</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-neutral-400">
                <li>Browser ke top right <strong>three dots (⋮)</strong> dabayein.</li>
                <li><strong className="text-white">'Add to Home Screen'</strong> ya <strong className="text-white">'Install App'</strong> select karein.</li>
                <li>Yeh app bila kisi rukawat Redmi home screen par chalegi!</li>
              </ol>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              Theek Hai (Got it)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
