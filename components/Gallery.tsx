"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { DesignWork } from "@/content/beyond";

// Gallery grid with a native <dialog> lightbox: Esc closes it and focus stays inside.
export function Gallery({ works }: { works: DesignWork[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<DesignWork | null>(null);

  return (
    <>
      <ul role="list" className="gallery">
        {works.map((work) => (
          <li key={work.src}>
            <button
              type="button"
              aria-label={`View larger: ${work.alt}`}
              onClick={() => {
                setOpen(work);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={work.src}
                alt={work.alt}
                width={work.width}
                height={work.height}
                sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 100vw"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="lightbox" aria-label="Design work">
        {open ? (
          <>
            <Image src={open.src} alt={open.alt} width={open.width} height={open.height} sizes="92vw" />
            <p>{open.alt}</p>
          </>
        ) : null}
        <button type="button" onClick={() => dialog.current?.close()}>
          Close
        </button>
      </dialog>
    </>
  );
}
