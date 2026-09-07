# SAIO — Senegal All In One

Portail public + backoffice pour la plateforme SAIO, développé à partir de `template.html`.

- **Front public** : Next.js 15 (App Router), rendu depuis PostgreSQL — mêmes styles que la maquette.
- **Backoffice** (`/admin`) : gestion des secteurs, services, redirections, pages éditoriales, publicités, médias, utilisateurs (rôles admin / éditeur), demandes de contact, journal d’activité.

## Prérequis

- Node.js ≥ 20 (testé avec 24)
- Docker (pour PostgreSQL)

## Démarrage rapide

```bash
cp .env.example .env          # ajustez AUTH_SECRET et le mot de passe admin
npm install
docker compose up -d          # PostgreSQL sur le port 5434
npm run db:push               # crée le schéma
npm run db:seed               # importe le contenu de template.html + crée l’admin
npm run dev                   # http://localhost:3000
```

Ou en une commande (après `npm install` et `.env`) : `npm run setup`.

### Comptes créés par le seed

| Rôle    | E-mail             | Mot de passe    |
|---------|--------------------|-----------------|
| Admin   | `admin@saio.sn`    | `ChangeMoi123!` (voir `SEED_ADMIN_PASSWORD`) |
| Éditeur | `editeur@saio.sn`  | `Editeur123!`   |

> Backoffice : http://localhost:3000/admin

## Scripts

| Commande            | Effet                                             |
|---------------------|---------------------------------------------------|
| `npm run dev`       | Serveur de développement                          |
| `npm run build`     | Build de production (`prisma generate` inclus)    |
| `npm run start`     | Serveur de production                             |
| `npm run db:up` / `db:down` | Démarre / arrête PostgreSQL              |
| `npm run db:push`   | Applique le schéma Prisma à la base               |
| `npm run db:seed`   | (Ré)importe le contenu depuis `prisma/seed-data.json` |
| `npm run db:studio` | Prisma Studio (exploration de la base)            |

## Architecture

```
prisma/
  schema.prisma        Modèles : User, Sector, Service, Page, Ad, Media, Redirect, Setting,
                       ContactSubmission, AuditLog
  seed.ts              Import initial (parse template.html → seed-data.json → DB + copie des images)
  seed-data.json       Contenu extrait de la maquette
seed-assets/           Images d’origine (copiées vers public/uploads au seed)
src/
  app/
    (site)/            Site public : accueil, /secteur/[sector]/[service], /e-senegal,
                       /briques, /faits, /vision, /contact
    admin/(dash)/      Backoffice (protégé par cookie de session + rôle)
    admin/login/       Connexion
    api/contact        Réception du formulaire de contact
    api/upload         Téléversement de médias (disque local → /public/uploads)
    go/service/[id]    Redirection trackée d’un service (compteur de clics)
    go/ad/[id]         Redirection trackée d’une publicité
    l/[slug]           Redirections courtes gérées dans le backoffice
  lib/                 db, auth (JWT + bcrypt), settings, content, forms, icons…
  components/          site/* et admin/*
  middleware.ts        Filtre d’accès /admin
```

## Ce qui est éditable depuis le backoffice

- **Secteurs / briques** : nom, slug, sous-titre, lead, bloc intro, image d’en-tête, icône,
  couleurs, statistiques, ordre, publication.
- **Services / sites** : secteur, nom, monogramme, textes (carte, accroche, « à propos »
  multi-paragraphes), **lien de redirection** + libellé du bouton, page interne liée,
  dégradé, logo, points clés, statut (actif / bientôt), mise en avant, ordre, publication.
- **Pages éditoriales** : accueil (hero + section « Investir »), e-Sénégal, faits marquants
  (chronologie), vision (piliers), contact (champs + coordonnées), briques.
- **Publicités** : visuel (upload ou URL), lien, emplacement, fenêtre de diffusion,
  activation, suivi impressions / clics / CTR.
- **Médiathèque** : upload d’images/vidéos, texte alternatif, suppression (bloquée si le
  média est utilisé).
- **Redirections** : liens courts `/l/<source>` → URL cible, compteur de hits.
- **Utilisateurs** : CRUD, rôles ADMIN / EDITOR, activation (garde-fou : au moins un admin
  actif). Réservé aux admins.
- **Demandes de contact** : consultation, statut (nouveau / lu / archivé).
- **Paramètres du site** : marque, liens de navigation et de pied de page, textes du footer.
- **Journal d’activité** : toutes les créations / modifications / suppressions.

## Passage en production

- Remplacer `AUTH_SECRET` par une valeur aléatoire forte, changer les mots de passe du seed.
- `DATABASE_URL` vers un PostgreSQL managé.
- Le stockage des médias est **local** (`public/uploads`). Pour un déploiement multi-instances
  ou serverless, brancher un stockage objet (S3 / R2) dans `src/app/api/upload/route.ts`.
- Servir derrière HTTPS (les cookies passent en `secure` automatiquement en production).
