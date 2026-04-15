'use client';

import styles from './PlayerHeadshot.module.css';

interface PlayerHeadshotProps {
  src: string;
  name: string;
  className?: string;
}

export function PlayerHeadshot({ src, name, className }: PlayerHeadshotProps) {
  return (
    <img
      src={src}
      alt={name}
      className={className}
      width={140}
      height={140}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=222228&color=F0F0F2&size=140`;
      }}
    />
  );
}
