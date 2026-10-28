import { useEffect } from "react";
import "@/styles/About.css";

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ab-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ab-modal-title">
      <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ab-modal__head">
          <h3 id="ab-modal-title">{title}</h3>
          <button className="ab-btn ab-btn--ghost" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="ab-modal__body">{children}</div>
      </div>
    </div>
  );
}
