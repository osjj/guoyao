# Glarivo

Glarivo is a focused independent-site MVP with four public sections:

- Home
- Products
- Blog
- About

The project also contains an initial `/admin` interface for future product and blog maintenance.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM 7
- PostgreSQL

## Local development

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

The public catalog still uses demonstration data from `src/data`. Product maintenance under `/admin/products` is PostgreSQL-backed with create/edit Server Actions, ordered images, pricing tiers, attributes, specifications, category, and product details. `/admin` requires an active `ADMIN` account. Blog persistence and the public-catalog database switch remain separate follow-up work.

## Quality checks

```powershell
npm run lint
npm run typecheck
npm run build
```

## Database

Update `DATABASE_URL` in `.env.local`, then run:

```powershell
npm run db:generate
npm run db:migrate -- --name init
```

Do not commit `.env.local`, production secrets, local uploads, or database backups.

## Admin access

Set a cryptographically random `SESSION_SECRET` of at least 32 bytes. Create or rotate an administrator from a trusted server terminal; the password is read from a temporary environment variable and is never printed:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_NAME = "Glarivo Administrator"
$secureAdminPassword = Read-Host "Admin password" -AsSecureString
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $secureAdminPassword).Password
npm run admin:create
Remove-Item Env:ADMIN_PASSWORD
```

The password must be at least 12 characters and contain uppercase, lowercase, numeric, and special characters. Creating an existing email rotates its password and invalidates its prior sessions. Open `/admin/login` to sign in. Five failed attempts lock the account for 15 minutes.

## R2 image storage

Product and blog images can be uploaded to the private `glarivoglass-media` bucket through the
server-side S3-compatible client in `src/lib/r2.ts`. Public reads use the custom hostname
`https://media.glarivoglass.com`; R2 credentials must never be exposed to browser code.

Add the five `R2_*` values from `.env.example` to the local and production environment, then run
the read/write smoke test:

```powershell
npm run r2:smoke
```

The smoke test uploads two versioned WebP files, verifies them through both the R2 API and the
public media hostname, and prints only their public URLs. It does not update the database.

## Case study image galleries

Each of the existing 20 case chapters can now contain up to 100 images. The chapter editor
supports selecting many files at once, shows upload progress, and retains successful uploads
when another file fails. Retry only failed files without uploading successful ones again.
Each image may be up to 12 MB and uses the existing R2 image conversion/upload endpoint.

Images can be reordered, removed, enlarged, and given individual alt text and captions.
Legacy `section.image` and imported `section.gallery` content remain readable; the editor and
article combine `image`, `images`, and `gallery` in that order without dropping any entries.
Editing the gallery saves the combined ordered images in `section.images` and clears the aliases.
The 100-image limit applies to the combined chapter total. No database migration is required, and removing an image does not
delete the stored R2 object. Uploads are separate requests; saving the case sends image URLs and
text, not the image files themselves.

The public case page and saved admin preview share the Guoyao article template. Image galleries
show full images in two columns on desktop and one on mobile, with lazy loading and an enlarge
preview. Existing single-image chapters stay full width.

## Case study videos

The case editor includes an optional **Project video** block above the chapters and an optional
**Chapter video** in each chapter. Imported `section.video` stays in its chapter; if its title is
missing, the chapter title is used. Upload an MP4
or WebM file (up to 50 MB), or enter a direct `.mp4` / `.webm` URL. Add a title, optional description,
and optional poster image URL. Use MP4 with H.264 for broad browser compatibility; files are
stored as supplied without transcoding. Video platform page URLs are not supported.

Video metadata is saved in the existing `CaseStudy.content` JSON. Existing cases without video
need no migration. Saved draft previews and public case pages use the same player with controls
and inline mobile playback; videos do not autoplay. Removing a video detaches it from the case
when saved and does not delete the uploaded object.

Unsupported content fields are rejected instead of silently removed. After upgrading the editor,
already-open older forms must be reloaded before saving, so they cannot overwrite stored galleries
or chapter videos that the older editor did not recognize.

Uploads use the configured `R2_*` bucket and public URL. The Guoyao Nginx example allows `55m`
request bodies for the 50 MB file plus multipart overhead; apply an equivalent limit in the
actual Guoyao reverse proxy when deploying. Changing the example does not update a running server.

Run `npx tsx --test tests/case-study-content.test.ts tests/case-study-video-upload.test.ts`
alongside the normal quality checks when changing this feature.

## Documentation

- `docs/GLARIVO_MVP_BUILD_AND_DEPLOY_GUIDE.md`
- `docs/GLARIVO_SERVER_ENVIRONMENT_INSTALLATION_INSTRUCTIONS.md`
