# Publishing Mission Commission

This folder is the whole website. Upload the folder itself (index.html must be at the top level).

## Easiest: Netlify Drop (free, about 2 minutes)
1. Go to https://app.netlify.com/drop and sign in.
2. Drag this `site` folder onto the page.
3. You get a live https link. Rename it under Site settings → Change site name.

## Alternative: Cloudflare Pages (free, fast in Pakistan)
Workers & Pages → Create → Pages → Upload assets → upload `mission-commission-site.zip`.

## After you have the final link
- In `index.html`, replace both `https://YOUR-DOMAIN/` with your real address, so the WhatsApp/Facebook link preview shows the picture.
- Whenever you upload changed files, raise `VERSION` in `sw.js` (mc-v1 → mc-v2) so installed phones pick up the update.

## Do NOT upload
- `Owner-Approval-Tool_1.html` (holds your signing key). Keep it on your own device.
- `Mission-Commission.html` / `_1.html` (old single-file builds; not needed).

## Note
The course lock is still the WhatsApp request + unlock code. Because the site is free, all questions are public in the files. That is fine for now; if access ever becomes paid, the questions need to move behind a server first.
