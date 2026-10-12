# SEO Setup - Kritika Bhagoria Portfolio

**Live URL:** https://kritikabhagoria-portfolio.vercel.app
**Last updated:** 2026-10-12

Yeh folder SEO ka record hai. Code sab laga hua hai aur site live hai. Neeche poora status, kya kya hua, aur future ke liye kya bacha hai.

---

## Live par kya kya laga hua hai (production checklist)

| # | Kaam | File | Status |
|---|------|------|--------|
| 1 | Title tag (49 chars, keyword-rich) | `index.html` | Done |
| 2 | Meta description (145 chars) | `index.html` | Done |
| 3 | Author + theme-color meta | `index.html` | Done |
| 4 | Robots directives + `max-image-preview:large` | `index.html` | Done |
| 5 | Canonical URL (real domain) | `index.html` | Done |
| 6 | Open Graph tags (Facebook, WhatsApp, LinkedIn preview) | `index.html` | Done |
| 7 | Twitter Card tags (large image preview) | `index.html` | Done |
| 8 | JSON-LD structured data - `Person` schema | `index.html` | Done |
| 9 | JSON-LD - `WebSite` + `ProfilePage` schema | `index.html` | Done |
| 10 | JSON-LD - `FAQPage` schema (rich results) | `src/App.tsx` | Done |
| 11 | Google Fonts `preconnect` (speed + SEO signal) | `index.html` | Done |
| 12 | `robots.txt` with sitemap reference | `public/robots.txt` | Done |
| 13 | `sitemap.xml` | `public/sitemap.xml` | Done |
| 14 | `site.webmanifest` (PWA + mobile) | `public/site.webmanifest` | Done |
| 15 | Heading hierarchy: ek `h1`, phir `h2` -> `h3` -> `h4` | `src/App.tsx` | Done |
| 16 | Email clickable (contact crawlability) | `src/App.tsx` | Done |
| 17 | External project links (entity signals) | `src/App.tsx` | Done |
| 18 | OG share image 1200x630 PNG | `public/og-image.png` | Done |
| 19 | Apple touch icon 180x180 PNG | `public/apple-touch-icon.png` | Done |
| 20 | Sitemap `lastmod` set | `public/sitemap.xml` | Done |
| 21 | Real profile photo (ranking boost) | `public/kritika.jpg` | Done |
| 22 | Google Analytics 4 - `G-RCVF76073B` | `index.html` | Done |
| 23 | Google Search Console verification file | `public/googlefa88019b53a66441.html` | Done |
| 24 | Bing Webmaster verification file | `public/BingSiteAuth.xml` | Done |
| 25 | `cleanUrls: false` (verification files + `.html` routes safe) | `vercel.json` | Done |
| 26 | Blog page (`#/blog`) separate from home | `src/App.tsx` | Done |
| 27 | Vision + FAQ sections | `src/App.tsx` | Done |

---

## Google jo IGNORE karta hai - isliye hata diya

| Hata diya | Kyun |
|-----------|------|
| `<meta name="keywords">` | Google ne 2009 mein hi isko ranking ke liye ignore karna shuru kar diya. 29 keywords likhne ka koi fayda nahi. |
| `<meta name="googlebot">` | `robots` meta pehle se `index, follow` bata raha hai. Yeh duplicate tha. |
| `maximum-scale=1` (viewport) | Mobile par pinch-to-zoom block karta hai - accessibility problem, Google mobile-friendly check flag karta hai. |

### Kahan keywords ab hain (yeh sahi tareeka hai)

1. **Title tag** - `Kritika Bhagoria | Digital Marketing & AI Creator`
2. **Meta description** - natural language mein primary terms
3. **Page content** - skills, projects, journey ke andar naturally
4. **Headings (`h1`-`h4`)** - AI Prompting, Website Building, Game Development etc.
5. **JSON-LD `knowsAbout`** - 12 skills structured data mein
6. **Project links** - Pizza Ride, Mind Test ke live URLs
7. **Alt text / file names** - image optimization

### Jo rakha hai aur REASON hai

| Rakha hai | Kyun zaroori hai |
|-----------|------------------|
| `max-image-preview:large` | Google images ko full size dikhata hai - image traffic badhta hai |
| `max-snippet:-1` | Poora paragraph snippet mein dikhta hai, sirf 160 chars nahi |
| `canonical` | Duplicate content ka signal - wrong URL index hone se rokta hai |
| JSON-LD structured data | Rich Results (FAQ, knowledge panel) - Google isko actively favour karta hai |
| Open Graph / Twitter Card | Ranking nahi, par WhatsApp/LinkedIn par link preview achha dikhta hai |
| `preconnect` fonts | LCP (load speed) improve - speed confirmed ranking signal hai |

---

## Verification + Analytics (account wale kaam - DONE)

| Kaam | Detail | Status |
|------|--------|--------|
| Google Search Console | Verification file `googlefa88019b53a66441.html` deploy + live 200 | Done |
| Bing Webmaster Tools | Verification file `BingSiteAuth.xml` deploy + live 200 | Done |
| Google Analytics 4 | Measurement ID `G-RCVF76073B`, gtag.js `index.html` head mein | Done |

> Naya milestone / page content badalne par GSC se `URL Inspection` -> `Request Indexing` dobara kar sakte hain.

---

## Target keywords (research ka record - tag nahi, content mein use)

| Priority | Keywords |
|----------|----------|
| Brand | kritika bhagoria |
| Primary | digital marketing, ai creator, ai prompting, prompt engineering |
| AI tools | claude, chatgpt, gemini, ai tools |
| Tech | website building, web development, game development, browser game, video creation |
| Marketing | digital marketer, social media marketing, content creation, copywriting, content strategy, seo |
| Business | freelancer, freelance web developer, business communication, sales mindset, problem solving |
| Long-tail | digital marketing portfolio, ai portfolio |
| Location | pundri, haryana, india |

**Kahan use hua:**
- `kritika bhagoria`, `digital marketing`, `ai creator` -> title + description
- `claude, chatgpt, gemini`, `website building`, `game development`, `video creation`, `social media marketing`, `content creation`, `copywriting` -> About/Skills content
- `freelancer`, `business communication`, `sales mindset`, `problem solving` -> Skills + Contact section
- `pundri, haryana, india` -> About, Contact, JSON-LD `address`

---

## Content structure (crawler ke liye)

Home page (single scroll) + Blog apne `#/blog` route par:

```
h1  I am Kritika.
h2  What I do, and where to explore it.
h2  Curiosity with a clear direction.   (About)
h2  Starting with curiosity.            (My journey)
h2  An evolving professional toolkit.   (My skills)
h3    AI & Tech Skills
h4      AI Prompting / Website Building / Game Development ...
h3    Marketing Skills
h3    Business Skills
h2  Built for real-world use.           (My projects)
h2  Beyond the work.                    (Vision)
h2  Frequently asked questions.         (FAQ -> FAQPage schema)
h2  Let's build something meaningful.   (Contact)

#/blog  Blog page (own route)
```

---

## Deploy workflow (jab bhi change karo)

1. `pnpm --filter kritika-portfolio run typecheck`
2. `pnpm --filter kritika-portfolio run build` (output: `dist/public`)
3. `git add -A` -> `git commit` -> `git push origin main`
4. `vercel --prod --yes` (project folder se)
5. Live URL par verify: canonical, verification files, analytics

> **Note:** PowerShell `&&` support nahi karta - commands alag chalao.

---

## Local dev notes

- Dev server: `http://127.0.0.1:5173/` use karo (`localhost` is machine par timeout deta hai)
- `vite.config.ts`: `PORT ?? '5173'`, `BASE_PATH ?? '/'`, `host: '127.0.0.1'`
- Startup helpers: `start.bat`, `start-portfolio.vbs`, `stop-portfolio.bat`

---

## Baad mein kar sakte ho (optional)

- [ ] Blog posts ke liye `BlogPosting` / `Article` JSON-LD schema
- [ ] Har blog post ka apna URL (abhi `#/blog` par cards hain)
- [ ] Ek aur project add karein (zyada internal credibility)
- [ ] Custom domain lagayein (phir saare URL update karne honge)
- [ ] `lastmod` date `public/sitemap.xml` mein content badalne par update karein
- [ ] Google Business Profile (local SEO, optional)
