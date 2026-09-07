import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { TextField } from "@/components/admin/Field";
import Repeater from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSiteSettings } from "./actions";

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();

  return (
    <>
      <div className="adm-top">
        <h1>Paramètres du site</h1>
      </div>
      <div className="adm-card">
        <form action={saveSiteSettings} className="adm-form">
          <div className="row">
            <TextField label="Nom de la marque" name="brandName" defaultValue={s.brandName} />
            <TextField label="Baseline" name="brandTagline" defaultValue={s.brandTagline} />
          </div>

          <Repeater
            name="navLinks"
            label="Liens de navigation"
            addLabel="Ajouter un lien"
            fields={[
              { key: "label", label: "Libellé" },
              { key: "href", label: "Lien", placeholder: "/briques" },
            ]}
            initial={s.navLinks}
          />

          <div className="row">
            <TextField label="Bouton d’appel — libellé" name="ctaLabel" defaultValue={s.ctaLabel} />
            <TextField label="Bouton d’appel — lien" name="ctaHref" defaultValue={s.ctaHref} />
          </div>

          <Repeater
            name="footerLinks"
            label="Liens du pied de page"
            addLabel="Ajouter un lien"
            fields={[
              { key: "label", label: "Libellé" },
              { key: "href", label: "Lien" },
            ]}
            initial={s.footerLinks}
          />

          <div className="row">
            <TextField label="Pied de page — gauche" name="footerLeft" defaultValue={s.footerLeft} />
            <TextField label="Pied de page — droite" name="footerRight" defaultValue={s.footerRight} />
          </div>

          <TextField
            label="E-mail destinataire des demandes de contact"
            name="contactRecipient"
            type="email"
            defaultValue={s.contactRecipient}
            hint="Informatif pour le moment (les demandes sont stockées dans le backoffice)."
          />

          <div className="adm-actions">
            <SubmitButton>Enregistrer les paramètres</SubmitButton>
          </div>
        </form>
      </div>
    </>
  );
}
