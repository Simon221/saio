"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children = "Enregistrer",
  className = "adm-btn",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending}>
      {pending ? "…" : children}
    </button>
  );
}
