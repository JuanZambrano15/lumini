import { type ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Modal accesible basado en <dialog>: maneja foco, Escape y fondo de forma nativa. */
export function Modal({ title, open, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-3xl p-0 shadow-2xl backdrop:bg-ink/60"
    >
      {open && (
        <div className="animate-pop p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="modal-title" className="text-2xl font-extrabold text-brand-700">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="grid size-9 shrink-0 place-items-center rounded-full text-xl hover:bg-brand-100"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
