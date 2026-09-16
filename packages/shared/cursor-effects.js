const TEXT_SELECTOR = "p, h1, h2, h3, h4, h5, h6, span, li, label, input, textarea";

export function installCursorEffects() {
  if (typeof window === "undefined" || document.body.dataset.cursorInstalled === "true") {
    return () => {};
  }

  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) {
    return () => {};
  }

  document.body.dataset.cursorInstalled = "true";
  const updateCursor = (event) => {
    document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
    const target = event.target instanceof Element ? event.target : null;
    const interactive = target?.closest("button, a");
    const text = target?.closest(TEXT_SELECTOR);
    document.body.dataset.cursorMode = interactive ? "button" : text ? "text" : "dot";

    if (text && !interactive) {
      const styles = window.getComputedStyle(text);
      const fontSize = Number.parseFloat(styles.fontSize);
      const lineHeight = styles.lineHeight === "normal" ? fontSize * 1.2 : Number.parseFloat(styles.lineHeight);
      document.body.style.setProperty("--cursor-text-height", `${Math.max(fontSize, lineHeight) * 1.05}px`);
    }
  };
  const resetCursor = () => {
    document.body.dataset.cursorMode = "dot";
    document.body.style.removeProperty("--cursor-text-height");
  };

  document.addEventListener("pointerover", updateCursor);
  document.addEventListener("pointermove", updateCursor);
  document.addEventListener("pointerout", resetCursor);

  return () => {
    document.removeEventListener("pointerover", updateCursor);
    document.removeEventListener("pointermove", updateCursor);
    document.removeEventListener("pointerout", resetCursor);
    delete document.body.dataset.cursorInstalled;
    delete document.body.dataset.cursorMode;
    document.body.style.removeProperty("--cursor-text-height");
  };
}
