import Link from "next/link";
import type { Ad } from "@prisma/client";
import { TextField, CheckField } from "@/components/admin/Field";
import MediaPicker, { type MediaItem } from "@/components/admin/MediaPicker";
import { SubmitButton } from "@/components/admin/SubmitButton";

function dt(d: Date | null) {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdForm({
  ad,
  media,
  placements,
  action,
}: {
  ad?: Ad | null;
  media: MediaItem[];
  placements: string[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="adm-form">
      {ad && <input type="hidden" name="id" value={ad.id} />}

      <TextField label="Titre interne" name="title" defaultValue={ad?.title} required />
      <TextField label="Lien de destination (URL)" name="linkUrl" type="url" defaultValue={ad?.linkUrl} required />

      <MediaPicker label="Visuel" name="imageId" media={media} defaultValue={ad?.imageId} hint="Ou renseignez une URL d’image ci-dessous." />
      <TextField label="URL d’image externe (optionnel)" name="imageUrl" type="url" defaultValue={ad?.imageUrl} />

      <TextField
        label="Emplacement"
        name="placement"
        defaultValue={ad?.placement ?? "home-mid"}
        hint={`Emplacements connus : ${placements.join(", ")}`}
      />

      <div className="row">
        <TextField label="Début de diffusion" name="startsAt" type="datetime-local" defaultValue={dt(ad?.startsAt ?? null)} />
        <TextField label="Fin de diffusion" name="endsAt" type="datetime-local" defaultValue={dt(ad?.endsAt ?? null)} />
      </div>

      <div className="row">
        <TextField label="Position (ordre)" name="position" type="number" defaultValue={ad?.position ?? 0} />
        <CheckField label="Active" name="active" defaultChecked={ad?.active ?? true} />
      </div>

      <div className="adm-actions">
        <SubmitButton>{ad ? "Enregistrer" : "Créer la publicité"}</SubmitButton>
        <Link href="/admin/ads" className="adm-btn ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
