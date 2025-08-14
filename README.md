# FastShip Pro — FedEx‑style Shipping Portal

A polished FedEx‑inspired shipping portal you can deploy. Create shipments, edit delivery (within rules), and show a tracking timeline.

**Stack:** Next.js (App Router) • Prisma • SQLite (dev) • Tailwind

## Quick start

```bash
npm i
npm run db:push
npm run seed         # optional demo data
npm run dev
```

Open http://localhost:3000

### Core routes
- `/` — homepage with quick tracking
- `/track?tn=...` — tracking details + timeline
- `/shipments/new` — create a shipment
- `/admin` — edit destination, change status, append timeline notes

### API
- `POST /api/shipments`
- `GET /api/shipments?trackingNumber=FS-XXXX`
- `PATCH /api/shipments/:tracking`

## Deploy
- **Vercel**: import the repo, set `DATABASE_URL` to a hosted Postgres (or use Vercel Postgres), run `prisma db push` in build step if needed.
- **Netlify/Render/Fly**: similar; ensure `DATABASE_URL` and Prisma generate are run.
- For a static-only host (GitHub Pages), APIs won't run — use Vercel for the backend.

## Notes
- Add authentication (NextAuth/Clerk) before going live.
- Add carrier integrations (Shippo/EasyPost/ShipEngine) for real labels & tracking webhooks.
- Theming is inspired by FedEx branding but **not affiliated**.
