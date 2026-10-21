import Image from "next/image";

// A real screenshot in a plain browser-window frame, with its source and date underneath.
export function FramedShot({
  src,
  alt,
  width,
  height,
  host,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  host: string;
  caption: string;
}) {
  return (
    <figure className="framed">
      <div className="frame-bar" aria-hidden="true">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="address">{host}</span>
      </div>
      <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 48rem) 40rem, 100vw" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
