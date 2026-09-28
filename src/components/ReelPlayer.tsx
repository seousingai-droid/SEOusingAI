"use client";
import { useRef, useState } from "react";

/**
 * Vertical reel with a clear "Play with sound" button. Browsers and phones can start
 * video muted or leave the volume unclear, so the first tap always plays unmuted at
 * full volume; after that the normal controls take over.
 */
export default function ReelPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const start = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    void v.play();
    setStarted(true);
  };
  return (
    <div className="relative mt-4">
      <video
        ref={ref}
        className="aspect-[9/16] w-full rounded-xl border border-line bg-canvas object-cover"
        src={src}
        poster={poster}
        controls={started}
        playsInline
        preload="metadata"
        aria-label={label}
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 grid place-items-center rounded-xl bg-night/15 transition-colors hover:bg-night/5"
          aria-label={`Play with sound: ${label}`}
        >
          <span className="flex items-center gap-2.5 rounded-full bg-mark px-5 py-3 font-semibold text-night shadow-xl">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>
            Play with sound
          </span>
        </button>
      )}
    </div>
  );
}
