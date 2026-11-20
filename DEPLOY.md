# Deploying Mission Commission

The whole site is static files. No build step.

## GitHub Pages
1. Push this folder to a GitHub repository.
2. Settings, Pages, Source: branch `main`, folder `/ (root)`, Save.
3. The site is at `https://USERNAME.github.io/REPO/`.

## Vercel
1. Vercel dashboard, Add New, Project, import the repository.
2. Framework Preset: Other. Leave Build Command and Output Directory empty.
3. Deploy.

## Netlify
Drag this folder onto `app.netlify.com/drop`, or run `netlify deploy --prod --dir=.`

## Cloudflare Pages
Create a project from the repository. Build command: none. Output directory: `/`.

## After the first deploy
1. Open the live site and tap Admin (top corner). Log in.
2. The "App website link" box fills with the site address. Keep it. Access links use it.
3. Send the live link to students.

## Updating
Replace the changed files and push. Pages, scripts and data load fresh on the next visit. If you change the pictures or PDFs under the same names, change `VERSION` in `sw.js` so devices drop their saved copies.

## Do not publish
The admin tool file and the admin password. They are not part of this folder.
