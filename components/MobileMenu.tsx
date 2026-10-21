"use client";

import { useRef } from "react";
import { NavLinks } from "./NavLinks";
import { Preferences } from "./Preferences";

// Full-screen menu in a native <dialog>. showModal() gives the focus trap and Esc to close for free.
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className="menu">
      <button type="button" className="menu-open" onClick={() => dialog.current?.showModal()}>
        Menu
      </button>
      <dialog ref={dialog} className="menu-dialog" aria-label="Menu">
        <div className="menu-top">
          <span className="menu-title">Menu</span>
          <button type="button" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <nav aria-label="Main">
          <NavLinks />
        </nav>
        <Preferences />
      </dialog>
    </div>
  );
}
