"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

/**
 * The header owns which mega panel is open. One key, one panel, one handler.
 *
 * **Why a single owner.** Visibility used to be derived per item from `:hover`
 * with `visibility` inside a 200ms transition. `visibility` is not
 * interpolatable — it holds its old value for the whole duration and flips at
 * the end — so traversing from one nav item to the next left the outgoing panel
 * *visible* while the incoming one was already up. Two full-width panels,
 * stacked, on every traverse. Measured: both `Insights` and `Why ARSAN` open
 * from +40ms to +150ms after the pointer moved.
 *
 * Shortening the duration would have made the overlap briefer, not impossible:
 * with CSS alone nothing knows *which* panel is open, so any timing on the way
 * out re-creates it. A single `openKey` makes two-open unrepresentable.
 *
 * **Why the events are delegated here.** Per-item `pointerenter` only knows
 * about the items. It has nothing to say about the logo, the locale switcher,
 * the CTA, or the bare header row — so sliding off a nav item onto any of them
 * left the panel hanging open with the pointer nowhere near it. One
 * `pointerover` on the header resolves whatever is under the pointer to a nav
 * key (or to none) and the state follows the pointer exactly. `pointerleave`
 * covers the way out: it fires only when the pointer leaves the element *and
 * all its DOM descendants*, and the panels and the strip of header padding
 * above them are descendants, so the one handler covers the whole surface.
 *
 * **Why `dismissed` is a ref, not state.** It is read inside the same
 * synchronous event sequence that writes it — `focus` lands before `click`, and
 * Escape moves focus while it runs. A state value would still be the old one.
 */
type NavMenuValue = { openKey: string | null };

const NavMenuContext = createContext<NavMenuValue | null>(null);

export function useNavMenu() {
  const ctx = useContext(NavMenuContext);
  if (!ctx) throw new Error("useNavMenu must be used inside <NavMenu>");
  return ctx;
}

/** Resolve whatever the pointer or focus is on to the nav item that owns it. */
function keyOf(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest("[data-nav-key]")?.getAttribute("data-nav-key") ?? null;
}

export function NavMenu({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  /**
   * `swap` rides along with the key because it has to land in the *same*
   * commit: moving between two open panels should read as one panel changing
   * its contents, not as one vanishing and another fading up through 200ms of
   * empty air. Deriving it in an effect would paint the fade first.
   */
  const [{ openKey, swap }, setMenu] = useState<{
    openKey: string | null;
    swap: boolean;
  }>({ openKey: null, swap: false });
  const ref = useRef<HTMLElement>(null);

  /** Set while a nav item has just been clicked and the pointer is still on it. */
  const dismissed = useRef<string | null>(null);

  /**
   * Pointer and focus both mean the same thing: this is the item the user is
   * on. The one exception is the item they just clicked — re-opening its panel
   * over the page it navigated to is the bug this guards.
   */
  const intent = useCallback((target: EventTarget | null) => {
    const key = keyOf(target);
    if (key !== null && key === dismissed.current) return;
    dismissed.current = null;
    setMenu((prev) =>
      prev.openKey === key
        ? prev
        : { openKey: key, swap: prev.openKey !== null && key !== null },
    );
  }, []);

  const close = useCallback(() => {
    dismissed.current = null;
    setMenu((prev) =>
      prev.openKey === null ? prev : { openKey: null, swap: false },
    );
  }, []);

  /**
   * Click-through dismissal. After a click the pointer is parked on the item,
   * so hover alone would put the panel straight back over the page just
   * requested. Remembering *which* item was clicked is what releases it: any
   * other item, or any move off the header, opens normally again — no timer,
   * and no global listener that a stray event can cancel.
   */
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    dismissed.current = keyOf(e.target);
    setMenu((prev) =>
      prev.openKey === null ? prev : { openKey: null, swap: false },
    );
  }, []);

  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Send focus back to the trigger rather than letting it fall to <body>
      // when the panel it is sitting in goes `visibility: hidden` — but only
      // if focus was in the header to begin with. A panel opened by hover
      // should not yank the caret out of whatever the user was typing in.
      // `dismissed` is what stops that focus from re-opening the panel.
      const wasFocused = ref.current?.contains(document.activeElement);
      dismissed.current = openKey;
      setMenu({ openKey: null, swap: false });
      if (wasFocused) {
        ref.current
          ?.querySelector<HTMLElement>(`[data-nav-key="${openKey}"] a`)
          ?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openKey]);

  return (
    <NavMenuContext.Provider value={{ openKey }}>
      <header
        ref={ref}
        className={cn("group/nav", className)}
        data-swap={swap ? "" : undefined}
        onPointerOver={(e) => intent(e.target)}
        onPointerLeave={close}
        onFocusCapture={(e) => intent(e.target)}
        onClickCapture={onClickCapture}
      >
        {children}
      </header>
    </NavMenuContext.Provider>
  );
}
