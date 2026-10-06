type LoopVideoProps = {
  src: string;
  className?: string;
};

export function LoopVideo({ src, className }: LoopVideoProps) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );
}
