'use client';

import { useState } from 'react';
import styles from './PlayerHeadshot.module.css';

interface PlayerHeadshotProps {
  src: string;
  name: string;
  className?: string;
}

// 1x1 transparent SVG as final fallback to prevent broken image icon
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'%3E%3Crect width='140' height='140' fill='%23222228'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='48' font-family='sans-serif'%3E?%3C/text%3E%3C/svg%3E";

export function PlayerHeadshot({ src, name, className }: PlayerHeadshotProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=222228&color=F0F0F2&size=140`);
    } else if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={name}
      className={className}
      width={140}
      height={140}
      onError={handleError}
    />
  );
}
