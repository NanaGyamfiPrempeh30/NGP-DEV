"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { DraftBadge } from "./DraftBadge";

export type GalleryWork = {
  id: string;
  title: string;
  alt: string;
  file: string;
  width: number;
  height: number;
  credit: string; // "Own work" or "Client work for ..."
  verified: boolean;
};

// Gallery grid with a native <dialog> lightbox: Esc closes it and focus stays inside.
export function Gallery({ works }: { works: GalleryWork[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<GalleryWork | null>(null);

  return (
    <>
      <ul role="list" className="gallery">
        {works.map((work) => (
          <li key={work.id}>
            <figure>
              <button
                type="button"
                aria-label={`View larger: ${work.title}`}
                onClick={() => {
                  setOpen(work);
                  dialog.current?.showModal();
                }}
              >
                <Image
                  src={work.file}
                  alt={work.alt}
                  width={work.width}
                  height={work.height}
                  sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 100vw"
                />
              </button>
              <figcaption>
                <span className="gallery-title">{work.title}</span>
                <span className="meta">{work.credit}</span>
              </figcaption>
            </figure>
            <DraftBadge verified={work.verified} />
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="lightbox" aria-label={open ? open.title : "Design work"}>
        {open ? (
          <>
            <Image src={open.file} alt={open.alt} width={open.width} height={open.height} sizes="92vw" />
            <p>{open.alt}</p>
            <p className="meta">{open.credit}</p>
          </>
        ) : null}
        <button type="button" onClick={() => dialog.current?.close()}>
          Close
        </button>
      </dialog>
    </>
  );
}
