
import { useRef, useState } from 'react';

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [playbackError, setPlaybackError] = useState('');

  const handleStart = async () => {
    const video = videoRef.current;

    if (!video || started) return;

    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      setStarted(true);
      setPlaybackError('');
    } catch (error) {
      console.error('Intro playback failed:', error);
      setPlaybackError('Playback could not start. Please try again.');
    }
  };

  return (
    <main className="fixed inset-0 z-[10000] h-dvh w-screen overflow-hidden bg-[#001933]">

      <video
        ref={videoRef}
        playsInline
        preload="auto"
        onEnded={onComplete}
        onError={() => setPlaybackError('Unable to load the intro video.')}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="/videos/idp-intro.mp4"
          type="video/mp4"
        />
      </video>

      {!started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/40 px-5">

          <button
            type="button"
            onClick={handleStart}
            className="rounded-2xl border border-blue-400/40 bg-[#001933]/90 px-9 py-7 text-center text-white shadow-2xl shadow-blue-500/20 backdrop-blur-md transition duration-300 hover:scale-105 hover:border-blue-300"
          >
            <span className="block text-2xl font-bold tracking-widest">
              IDP SYSTEM
            </span>

            <span className="mt-5 block rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-8 py-4 text-base font-semibold shadow-lg">
              Start IDP Experience
            </span>

            <span className="mt-3 block text-sm text-blue-200">
              Click to begin with sound
            </span>
          </button>

        </div>
      )}

      {playbackError && (
        <div
          role="alert"
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-red-950/90 px-5 py-3 text-sm text-white"
        >
          {playbackError}
        </div>
      )}

    </main>
  );
}
