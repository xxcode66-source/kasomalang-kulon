Vercel deployment instructions

Preferred option (recommended): set project to use the web app folder as root

- Root Directory: `sid-kk/apps/web`
- Install Command: `npm ci`
- Build Command: `npm --workspace=apps/web run build`
- Output Directory: leave empty (Next.js default)

Alternative (deploy from monorepo root):

- Root Directory: `sid-kk`
- Install Command: `npm ci`
- Build Command: `npm run build:web`
- Output Directory: leave empty

If you prefer to use `vercel.json` the repo includes one which instructs Vercel to build the Next.js app at `sid-kk/apps/web`.

Local verification:
```
cd sid-kk/apps/web
npm ci
npm run build
npm run start
# open http://localhost:3000
```

Editor / TypeScript notes:
- If VSCode shows errors like "Cannot find module 'next'" run `npm ci` at `sid-kk` or `sid-kk/apps/web` so `node_modules` are available for the TypeScript server, then restart the TS server.
