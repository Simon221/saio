import Link from "next/link";
import type { Service, Sector } from "@prisma/client";
import { TextField, TextArea, SelectField, CheckField } from "@/components/admin/Field";
import ColorField from "@/components/admin/ColorField";
import MediaPicker, { type MediaItem } from "@/components/admin/MediaPicker";
import Repeater from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default function ServiceForm({
  service,
  sectors,
  media,
  action,
}: {
  service?: Service | null;
  sectors: Pick<Sector, "id" | "name">[];
  media: MediaItem[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  const keyPoints = ((service?.keyPoints as string[]) ?? []).map((t) => ({ text: t }));

  return (
    <form action={action} className="adm-form">
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="row">
        <SelectField
          label="Secteur"
          name="sectorId"
          defaultValue={service?.sectorId ?? sectors[0]?.id}
          options={sectors.map((s) => ({ value: s.id, label: s.name }))}
        />
        <TextField label="Nom du service" name="name" defaultValue={service?.name} required />
      </div>

      <div className="row">
        <TextField
          label="Slug (URL)"
          name="slug"
          defaultValue={service?.slug}
          hint="Unique. Ex : egov-e-jokkoo"
        />
        <TextField
          label="Monogramme"
          name="monogram"
          defaultValue={service?.monogram}
          hint="1 à 3 lettres affichées dans la pastille"
        />
      </div>

      <TextArea
        label="Texte de la carte (grille du secteur)"
        name="cardText"
        defaultValue={service?.cardText}
        rows={2}
      />
      <TextArea label="Accroche (page du service)" name="tagline" defaultValue={service?.tagline} rows={2} />
      <TextArea
        label="À propos"
        name="about"
        defaultValue={service?.about}
        rows={6}
        hint="Séparez les paragraphes par une ligne vide."
      />

      <div className="row">
        <TextField
          label="Lien de redirection (URL externe)"
          name="redirectUrl"
          type="url"
          defaultValue={service?.redirectUrl}
          hint="Vide = bouton « Lien à renseigner »"
        />
        <TextField
          label="Libellé du bouton"
          name="ctaLabel"
          defaultValue={service?.ctaLabel}
          hint="Ex : Accéder à Wave"
        />
      </div>

      <TextField
        label="Page interne liée (optionnel)"
        name="linkPage"
        defaultValue={service?.linkPage}
        hint="Slug d’une page éditoriale (ex : esenegal). Prioritaire sur la page service."
      />

      <div className="row">
        <ColorField label="Dégradé — début" name="gradientFrom" defaultValue={service?.gradientFrom ?? "#1B44E4"} />
        <ColorField label="Dégradé — fin" name="gradientTo" defaultValue={service?.gradientTo ?? "#122F9F"} />
      </div>

      <MediaPicker label="Logo du service (optionnel)" name="logoImageId" media={media} defaultValue={service?.logoImageId} />

      <Repeater
        name="keyPoints"
        label="Points clés (encadré latéral)"
        addLabel="Ajouter un point"
        fields={[{ key: "text", label: "Point", placeholder: "Plus de 10 000 téléchargements" }]}
        initial={keyPoints}
      />

      <div className="row">
        <SelectField
          label="Statut"
          name="status"
          defaultValue={service?.status ?? "ACTIVE"}
          options={[
            { value: "ACTIVE", label: "Actif" },
            { value: "SOON", label: "Bientôt disponible" },
          ]}
        />
        <TextField label="Position (ordre)" name="position" type="number" defaultValue={service?.position ?? 0} />
      </div>

      <div className="row">
        <CheckField label="Mis en avant (fond gris dans la grille)" name="highlighted" defaultChecked={service?.highlighted ?? false} />
        <CheckField label="Publié" name="published" defaultChecked={service?.published ?? true} />
      </div>

      <div className="adm-actions">
        <SubmitButton>{service ? "Enregistrer" : "Créer le service"}</SubmitButton>
        <Link href="/admin/services" className="adm-btn ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
