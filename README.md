# Mission Commission

ISSB preparation for armed forces. A static website with timed mock tests (30 minutes each), results and review, study files, and a course access system.

## Courses
Technical Cadet Course, Long Course, Army Medical Course, PN Cadet, ISSB, Initial Interview, AFNS, LCC, PAF, SCC, PMA. Each course has Verbal, Non-Verbal and Academics portions and a Files tab.

## Project structure
| Path | What it is |
|---|---|
| `index.html` | The page shell |
| `style.css` | All styles (army theme, light and dark) |
| `app.js` | All app code: screens, exam engine, results, access system, admin |
| `data/tests.js` | Every test and question |
| `data/files.js` | The study files shown in the Files tab |
| `data/admin.js` | Encrypted signing key for the admin. Do not delete |
| `images/` | Pictures for non-verbal questions |
| `pdfs/` | Study PDFs |
| `icons/` | Logo and app icons |
| `manifest.webmanifest`, `sw.js` | Install-to-home-screen and offline support |
| `_headers` | Security and cache headers (Netlify, Cloudflare Pages) |
| `og-image.png` | Preview image when the link is shared |
| `privacy.html` | Privacy page |
| `.nojekyll` | Makes GitHub Pages serve the files as they are |

## How access works
1. A student taps a locked course. WhatsApp opens with a ready request to the owner.
2. The owner opens the Admin button (top corner), logs in, pastes the request and taps Allow or Deny.
3. Allow produces a link. The owner sends it on WhatsApp. Tapping it unlocks that course on the student's device for 30 days.
4. After 30 days the course locks again.

This is a client-side system. It stops casual sharing but cannot hide the questions from a technical user. A server version is the next step.

## Adding or changing questions
Edit `data/tests.js`. Each test is `{ sub, part, shared?, qs: [ { q, o: [options], a: <index of correct option>, img?: 'file.jpg' } ] }`. `part` is `verbal`, `nonverbal` or `academics`. Picture questions use `img` (a file in `images/`) and `o` holds the printed labels.

## Run locally
Any static server works, for example `python3 -m http.server 8000` in this folder, then open `http://localhost:8000`.

## Admin login
Not stored in this repository. Keep the admin username and password private.
