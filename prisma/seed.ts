import "dotenv/config";
import { readFileSync, copyFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, ServiceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const ROOT = join(__dirname, "..");
const UPLOADS = join(ROOT, "public", "uploads");
const ASSETS = join(ROOT, "seed-assets");

type SvcJson = {
  slug: string | null;
  name: string;
  monogram: string;
  cardText: string;
  tagline: string;
  about: string;
  highlighted: boolean;
  status: string;
  redirectUrl: string | null;
  ctaLabel: string | null;
  keyPoints: string[];
  gradientFrom: string;
  gradientTo: string;
};
type SectorJson = {
  slug: string;
  name: string;
  subtitle: string;
  iconBg: string;
  lead: string;
  introTitle: string;
  introText: string;
  heroAlt: string;
  stats: unknown[];
  tint: string;
  accent: string;
  services: SvcJson[];
};
type SeedData = { sectors: SectorJson[]; pages: Record<string, any> };

const ICON_KEY: Record<string, string> = {
  egov: "gov",
  eedu: "edu",
  etransport: "transport",
  esante: "health",
  ecommerce: "commerce",
  eagri: "agri",
  efinances: "finance",
};

// Fichier image du seed par slug de secteur / page
const IMG_FOR: Record<string, string> = {
  "home-hero": "01_home-hero.jpeg",
  "esenegal-cta": "02_esenegal-cta.jpeg",
  "esenegal-stats": "03_esenegal-stats.jpeg",
  egov: "04_egov.jpeg",
  eedu: "05_eedu.jpeg",
  etransport: "06_etransport.jpeg",
  esante: "07_esante.jpeg",
  ecommerce: "08_ecommerce.jpeg",
  eagri: "09_eagri.jpeg",
  efinances: "10_efinances.jpeg",
};

async function ensureMedia(key: string, alt: string): Promise<string | null> {
  const file = IMG_FOR[key];
  if (!file) return null;
  const src = join(ASSETS, file);
  if (!existsSync(src)) return null;
  const dest = join(UPLOADS, file);
  if (!existsSync(dest)) copyFileSync(src, dest);
  const { size } = (await import("node:fs")).statSync(src);
  const existing = await db.media.findFirst({ where: { url: `/uploads/${file}` } });
  if (existing) return existing.id;
  const m = await db.media.create({
    data: {
      filename: file,
      url: `/uploads/${file}`,
      mimeType: "image/jpeg",
      size,
      alt,
      kind: "image",
    },
  });
  return m.id;
}

async function main() {
  mkdirSync(UPLOADS, { recursive: true });

  const data: SeedData = JSON.parse(
    readFileSync(join(ROOT, "prisma", "seed-data.json"), "utf8"),
  );

  // ---------- Admin ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@saio.sn";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "ChangeMoi123!";
  const adminName = process.env.SEED_ADMIN_NAME || "Administrateur SAIO";
  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPass, 10),
    },
  });
  // Éditeur de démonstration
  await db.user.upsert({
    where: { email: "editeur@saio.sn" },
    update: {},
    create: {
      email: "editeur@saio.sn",
      name: "Éditeur démo",
      role: "EDITOR",
      passwordHash: await bcrypt.hash("Editeur123!", 10),
    },
  });
  console.log(`✓ Admin : ${adminEmail} / ${adminPass}`);

  // ---------- Secteurs + services ----------
  for (let i = 0; i < data.sectors.length; i++) {
    const s = data.sectors[i];
    const heroImageId = await ensureMedia(s.slug, s.heroAlt || s.name);
    const sector = await db.sector.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        subtitle: s.subtitle,
        lead: s.lead,
        introTitle: s.introTitle ?? "",
        introText: s.introText ?? "",
        heroAlt: s.heroAlt || s.name,
        heroImageId,
        iconKey: ICON_KEY[s.slug] ?? "gov",
        iconBg: s.iconBg,
        accent: s.accent,
        tint: s.tint,
        stats: s.stats as object,
        position: i,
      },
      create: {
        slug: s.slug,
        name: s.name,
        subtitle: s.subtitle,
        lead: s.lead,
        introTitle: s.introTitle ?? "",
        introText: s.introText ?? "",
        heroAlt: s.heroAlt || s.name,
        heroImageId,
        iconKey: ICON_KEY[s.slug] ?? "gov",
        iconBg: s.iconBg,
        accent: s.accent,
        tint: s.tint,
        stats: s.stats as object,
        position: i,
      },
    });

    for (let j = 0; j < s.services.length; j++) {
      const v = s.services[j];
      const slug = v.slug ?? `${s.slug}-${slugify(v.name)}`;
      const linkPage = slug === "esenegal" ? "esenegal" : null;
      await db.service.upsert({
        where: { slug },
        update: {
          sectorId: sector.id,
          name: v.name,
          monogram: v.monogram,
          cardText: v.cardText,
          tagline: v.tagline || v.cardText,
          about: v.about,
          gradientFrom: v.gradientFrom,
          gradientTo: v.gradientTo,
          redirectUrl: v.redirectUrl,
          ctaLabel: v.ctaLabel,
          status: (v.status as ServiceStatus) ?? "ACTIVE",
          highlighted: v.highlighted,
          keyPoints: v.keyPoints as object,
          linkPage,
          position: j,
          createdById: admin.id,
        },
        create: {
          sectorId: sector.id,
          slug,
          name: v.name,
          monogram: v.monogram,
          cardText: v.cardText,
          tagline: v.tagline || v.cardText,
          about: v.about,
          gradientFrom: v.gradientFrom,
          gradientTo: v.gradientTo,
          redirectUrl: v.redirectUrl,
          ctaLabel: v.ctaLabel,
          status: (v.status as ServiceStatus) ?? "ACTIVE",
          highlighted: v.highlighted,
          keyPoints: v.keyPoints as object,
          linkPage,
          position: j,
          createdById: admin.id,
        },
      });
    }
    console.log(`✓ Secteur ${s.slug} (${s.services.length} services)`);
  }

  // ---------- Pages de contenu ----------
  const homeImg = await ensureMedia("home-hero", "Le Sénégal digitalisé");
  const esCtaImg = await ensureMedia("esenegal-cta", "e-Sénégal");
  const esStatsImg = await ensureMedia("esenegal-stats", "e-Sénégal");

  const pages: { slug: string; title: string; eyebrow: string; intro: string; data: any }[] = [
    {
      slug: "home",
      title: "Accueil",
      eyebrow: "",
      intro: "",
      data: {
        ...data.pages.home,
        hero: { ...data.pages.home.hero, imageId: homeImg },
      },
    },
    {
      slug: "esenegal",
      title: data.pages.esenegal.title,
      eyebrow: "e-Sénégal",
      intro: data.pages.esenegal.lead,
      data: { ...data.pages.esenegal, ctaImageId: esCtaImg, statsImageId: esStatsImg },
    },
    {
      slug: "briques",
      title: data.pages.briques.title,
      eyebrow: data.pages.briques.eyebrow,
      intro: data.pages.briques.intro,
      data: data.pages.briques.data ?? {},
    },
    {
      slug: "faits",
      title: data.pages.faits.title,
      eyebrow: data.pages.faits.eyebrow,
      intro: data.pages.faits.intro,
      data: data.pages.faits.data,
    },
    {
      slug: "vision",
      title: data.pages.vision.title,
      eyebrow: data.pages.vision.eyebrow,
      intro: data.pages.vision.intro,
      data: data.pages.vision.data,
    },
    {
      slug: "contact",
      title: data.pages.contact.title,
      eyebrow: data.pages.contact.eyebrow,
      intro: data.pages.contact.intro,
      data: data.pages.contact.data,
    },
  ];

  for (const p of pages) {
    await db.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, eyebrow: p.eyebrow, intro: p.intro, data: p.data },
      create: p,
    });
    console.log(`✓ Page ${p.slug}`);
  }

  // ---------- Paramètres ----------
  await db.setting.upsert({
    where: { key: "site" },
    update: {},
    create: { key: "site", value: {} },
  });

  // ---------- Publicité de démonstration ----------
  const adCount = await db.ad.count();
  if (adCount === 0) {
    await db.ad.create({
      data: {
        title: "Investir au Sénégal — New Deal Technologique",
        imageUrl: "",
        linkUrl: "https://www.sec.gouv.sn",
        placement: "home-mid",
        active: false,
        position: 0,
      },
    });
    console.log("✓ Publicité de démonstration (désactivée)");
  }

  // ---------- Redirections de démonstration ----------
  await db.redirect.upsert({
    where: { source: "/wave" },
    update: {},
    create: { source: "/wave", target: "https://www.wave.com", note: "Raccourci démo" },
  });

  console.log("\n✅ Seed terminé.");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
