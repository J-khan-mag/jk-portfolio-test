import { useState } from 'react';
import type { Img } from '../data/images';

type Props = {
  img: Img;
  alt: string;
  sizes: string;
  className?: string;
  /** 'cover' crops to fill its box; 'contain' shows the whole plate, never cropped. */
  variant?: 'cover' | 'contain';
  priority?: boolean;
  onClick?: () => void;
};

export default function Figure({
  img,
  alt,
  sizes,
  className,
  variant = 'cover',
  priority,
  onClick,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  // The blur placeholder only makes sense when the image fills its box.
  const style =
    variant === 'cover'
      ? {
          backgroundImage: `url("${img.blur}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : undefined;

  return (
    <div className={className} onClick={onClick} style={style}>
      <img
        src={img.sm}
        srcSet={`${img.sm} 1200w, ${img.src} 2400w`}
        sizes={sizes}
        alt={alt}
        width={img.w}
        height={img.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
