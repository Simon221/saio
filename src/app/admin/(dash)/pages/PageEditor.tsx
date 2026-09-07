import Link from "next/link";
import type { Page } from "@prisma/client";
import { TextField, TextArea } from "@/components/admin/Field";
import MediaPicker, { type MediaItem } from "@/components/admin/MediaPicker";
import Repeater from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";

type AnyData = Record<string, any>;

function Head({ page }: { page: Page }) {
  return (
    <>
      <TextField label="Titre" name="title" defaultValue={page.title} required />
      <div className="row">
        <TextField label="Sur-titre (eyebrow)" name="eyebrow" defaultValue={page.eyebrow} />
        <div />
      </div>
      <TextArea label="Introduction" name="intro" defaultValue={page.intro} rows={3} />
    </>
  );
}

export default function PageEditor({
  page,
  media,
  action,
}: {
  page: Page;
  media: MediaItem[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  const d = (page.data as AnyData) ?? {};

  return (
    <form action={action} className="adm-form">
      <input type="hidden" name="slug" value={page.slug} />
      <Head page={page} />

      {page.slug === "home" && (
        <>
          <h3 style={{ margin: "8px 0 0" }}>En-tête (hero)</h3>
          <TextField label="Badge" name="hero_badge" defaultValue={d.hero?.badge} />
          <TextField label="Titre du hero" name="hero_title" defaultValue={d.hero?.title} />
          <TextArea label="Texte du hero" name="hero_text" defaultValue={d.hero?.text} rows={2} />
          <TextField label="Texte alternatif de l’image" name="hero_imageAlt" defaultValue={d.hero?.imageAlt} />
          <MediaPicker label="Image du hero" name="hero_imageId" media={media} defaultValue={d.hero?.imageId} />

          <h3 style={{ margin: "16px 0 0" }}>Section « Investir au Sénégal »</h3>
          <TextField label="Sur-titre" name="inv_eyebrow" defaultValue={d.invest?.eyebrow} />
          <TextField label="Titre" name="inv_title" defaultValue={d.invest?.title} />
          <TextArea label="Sous-texte" name="inv_sub" defaultValue={d.invest?.sub} rows={2} />
          <Repeater
            name="kpis"
            label="Chiffres clés (KPI)"
            addLabel="Ajouter un KPI"
            fields={[
              { key: "value", label: "Valeur", placeholder: "96,5 %" },
              { key: "label", label: "Libellé", type: "textarea" },
            ]}
            initial={d.invest?.kpis ?? []}
          />
          <Repeater
            name="atouts"
            label="Atouts"
            addLabel="Ajouter un atout"
            fields={[
              { key: "title", label: "Titre" },
              { key: "body", label: "Texte", type: "textarea" },
            ]}
            initial={d.invest?.atouts ?? []}
          />
          <TextField label="GSMA — bandeau" name="gsma_tag" defaultValue={d.invest?.gsma?.tag} />
          <TextArea label="GSMA — texte" name="gsma_body" defaultValue={d.invest?.gsma?.body} rows={3} />
          <Repeater
            name="gsma_mini"
            label="GSMA — mini-chiffres"
            addLabel="Ajouter un chiffre"
            fields={[
              { key: "value", label: "Valeur", placeholder: "+2,6 M" },
              { key: "label", label: "Libellé" },
            ]}
            initial={d.invest?.gsma?.mini ?? []}
          />
        </>
      )}

      {page.slug === "esenegal" && (
        <>
          <TextField label="Lien retour (libellé)" name="backLabel" defaultValue={d.backLabel} />
          <TextField label="Titre" name="es_title" defaultValue={d.title} />
          <TextField label="Logo (texte)" name="logo" defaultValue={d.logo} />
          <TextField label="Bloc CTA — titre" name="ctaTitle" defaultValue={d.ctaTitle} />
          <TextArea label="Bloc CTA — texte" name="ctaText" defaultValue={d.ctaText} rows={4} />
          <TextField label="Bloc CTA — libellé pilule" name="ctaPill" defaultValue={d.ctaPill} />
          <TextArea label="Phrase lead" name="lead" defaultValue={d.lead} rows={3} />
          <MediaPicker label="Image du bloc CTA" name="ctaImageId" media={media} defaultValue={d.ctaImageId} />
          <MediaPicker label="Image du bloc statistiques" name="statsImageId" media={media} defaultValue={d.statsImageId} />
          <Repeater
            name="stats"
            label="Statistiques"
            addLabel="Ajouter une statistique"
            fields={[
              { key: "value", label: "Valeur" },
              { key: "label", label: "Libellé", type: "textarea" },
              { key: "variant", label: "Variante (plain / blue)" },
            ]}
            initial={d.stats ?? []}
          />
        </>
      )}

      {page.slug === "faits" && (
        <Repeater
          name="timeline"
          label="Chronologie"
          addLabel="Ajouter un jalon"
          fields={[
            { key: "date", label: "Date", placeholder: "Fév. 2025" },
            { key: "title", label: "Titre" },
            { key: "body", label: "Texte", type: "textarea" },
          ]}
          initial={d.timeline ?? []}
        />
      )}

      {page.slug === "vision" && (
        <>
          <Repeater
            name="pillars"
            label="Piliers"
            addLabel="Ajouter un pilier"
            fields={[
              { key: "n", label: "Numéro", placeholder: "01" },
              { key: "title", label: "Titre" },
              { key: "body", label: "Texte", type: "textarea" },
            ]}
            initial={d.pillars ?? []}
          />
          <TextArea label="Encadré (note)" name="note" defaultValue={d.note} rows={2} />
        </>
      )}

      {page.slug === "contact" && (
        <>
          <Repeater
            name="fields"
            label="Champs du formulaire (5 champs : structure, contact, e-mail, brique, message)"
            addLabel="Ajouter un champ"
            fields={[
              { key: "label", label: "Libellé" },
              { key: "placeholder", label: "Placeholder" },
            ]}
            initial={d.fields ?? []}
          />
          <Repeater
            name="info"
            label="Blocs d’information de contact"
            addLabel="Ajouter un bloc"
            fields={[
              { key: "title", label: "Titre" },
              { key: "body", label: "Texte", type: "textarea" },
            ]}
            initial={d.info ?? []}
          />
        </>
      )}

      <div className="adm-actions">
        <SubmitButton>Enregistrer</SubmitButton>
        <Link href="/admin/pages" className="adm-btn ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
