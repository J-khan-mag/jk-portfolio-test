import { useEffect, useRef, useState } from 'react';
import Figure from './Figure';
import Mosaic from './Mosaic';
import type { Video } from '../data/projects';

/**
 * A moving plate. Holds its poster until it is on screen, then plays muted on
 * a loop; it stops again the moment it leaves, so nothing decodes off-screen.
 * It takes the same black-and-white grade and the same grain as the stills.
 */
export default function VideoPlate({
  video,
  alt,
  caption,
}: {
  video: Video;
  alt: string;
  caption?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const still =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (still) return; // the poster is the whole story for reduced motion
    const host = hostRef.current;
    const v = ref.current;
    if (!host || !v) return;
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.25 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, [still]);

  return (
    <figure className="vplate" ref={hostRef}>
      <div className="vplate-frame">
        {/* the poster carries the reveal, so there is never an empty box */}
        <Figure img={video.poster} alt={alt} sizes="(max-width: 900px) 92vw, 620px" className="fill" />
        {!still && (
        <video
          ref={ref}
          className={`vplate-vid${ready ? ' ready' : ''}`}
          src={video.src}
          poster={video.poster.sm}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          aria-label={alt}
        />
        )}
        <Mosaic tone="light" />
      </div>
      {caption && (
        <figcaption className="label num vplate-cap">
          <span className="vplate-dot" aria-hidden />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
