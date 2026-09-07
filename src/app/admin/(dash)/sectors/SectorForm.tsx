import Link from "next/link";
import type { Sector } from "@prisma/client";
import { TextField, TextArea, SelectField, CheckField } from "@/components/admin/Field";
import ColorField from "@/components/admin/ColorField";
import MediaPicker, { type MediaItem } from "@/components/admin/MediaPicker";
import Repeater from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ICON_KEYS } from "@/lib/icons";

export default function SectorForm({
  sector,
  media,
  action,
}: {
  sector?: Sector | null;
  media: MediaItem[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  const stats = (sector?.stats as { value: string; label: string; variant?: string }[]) ?? [];

  return (
    <form action={action} className="adm-form">
      {sector && <input type="hidden" name="id" value={sector.id} />}

      <div className="row">
        <TextField label="Nom" name="name" defaultValue={sector?.name} required />
        <TextField
          label="Slug (URL)"
          name="slug"
          defaultValue={sector?.slug}
          hint="Laisser vide pour générer depuis le nom. Ex : egov"
        />
      </div>

      <TextField label="Sous-titre" name="subtitle" defaultValue={sector?.subtitle} hint="Ex : Services de l’État" />
      <TextArea label="Phrase d’accroche (lead)" name="lead" defaultValue={sector?.lead} rows={3} />

      <div className="row">
        <TextField label="Titre du bloc « intro »" name="introTitle" defaultValue={sector?.introTitle} />
        <TextField label="Texte alternatif de l’image d’en-tête" name="heroAlt" defaultValue={sector?.heroAlt} />
      </div>
      <TextArea label="Texte du bloc « intro »" name="introText" defaultValue={sector?.introText} rows={3} />

      <MediaPicker label="Image d’en-tête (hero)" name="heroImageId" media={media} defaultValue={sector?.heroImageId} />

      <div className="row">
        <SelectField
          label="Icône"
          name="iconKey"
          defaultValue={sector?.iconKey ?? "gov"}
          options={ICON_KEYS.map((k) => ({ value: k, label: k }))}
        />
        <ColorField label="Fond de l’icône" name="iconBg" defaultValue={sector?.iconBg ?? "#C9CEF6"} />
      </div>
      <div className="row">
        <ColorField label="Couleur d’accent" name="accent" defaultValue={sector?.accent ?? "#1B44E4"} />
        <ColorField label="Teinte claire (chip)" name="tint" defaultValue={sector?.tint ?? "#E7EBFB"} />
      </div>

      <Repeater
        name="stats"
        label="Statistiques (bloc 3 chiffres)"
        addLabel="Ajouter une statistique"
        fields={[
          { key: "value", label: "Valeur", placeholder: "95 %" },
          { key: "label", label: "Libellé", type: "textarea" },
          { key: "variant", label: "Variante (plain / blue)", placeholder: "plain" },
        ]}
        initial={stats}
      />

      <div className="row">
        <TextField label="Position (ordre)" name="position" type="number" defaultValue={sector?.position ?? 0} />
        <CheckField label="Publié" name="published" defaultChecked={sector?.published ?? true} />
      </div>

      <div className="adm-actions">
        <SubmitButton>{sector ? "Enregistrer" : "Créer le secteur"}</SubmitButton>
        <Link href="/admin/sectors" className="adm-btn ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
