import { getPage } from "@/lib/content";
import ContactForm from "@/components/site/ContactForm";

type ContactData = {
  fields?: { label: string; placeholder?: string }[];
  info?: { title: string; body: string }[];
};

export default async function ContactPage() {
  const page = await getPage("contact");
  const d = (page?.data as ContactData) ?? {};

  return (
    <section className="page active">
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{page?.eyebrow || "Contacts"}</p>
          <h1>{page?.title || "Intégrer la plateforme SAIO"}</h1>
          {page?.intro && <p>{page.intro}</p>}
        </div>

        <ContactForm fields={d.fields ?? []} />

        {d.info && d.info.length > 0 && (
          <div className="contact-info">
            {d.info.map((ci, i) => (
              <div className="ci" key={i}>
                <h4>{ci.title}</h4>
                <p>{ci.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
