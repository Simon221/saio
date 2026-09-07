"use client";

export default function DeleteButton({
  action,
  id,
  label = "Supprimer",
  confirm = "Confirmer la suppression ? Cette action est définitive.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirm?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="adm-btn danger sm" type="submit">
        {label}
      </button>
    </form>
  );
}
