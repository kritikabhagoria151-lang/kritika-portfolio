# SEO Setup — Kritika Bhagoria Portfolio

Yeh folder document ke liye hai. Code pehle se laga hua hai — aapko sirf **ek cheez** badalni hai deploy ke baad (neeche Step 1 dekhein).

---

## Kya kya kiya gaya (already done)

| # | Kaam | File | Status |
|---|------|------|--------|
| 1 | Title tag (49 chars, keyword-rich) | `index.html` | Done |
| 2 | Meta description (145 chars) | `index.html` | Done |
| 3 | Author + theme-color meta | `index.html` | Done |
| 4 | Robots directives + `max-image-preview:large` | `index.html` | Done |
| 5 | Canonical URL | `index.html` | Done (placeholder URL) |
| 6 | Open Graph tags (Facebook, WhatsApp, LinkedIn preview) | `index.html` | Done |
| 7 | Twitter Card tags (large image preview) | `index.html` | Done |
| 8 | JSON-LD structured data — `Person` schema | `index.html` | Done |
| 9 | JSON-LD — `WebSite` + `ProfilePage` schema | `index.html` | Done |
| 10 | Google Fonts `preconnect` (speed + SEO signal) | `index.html` | Done |
| 11 | `robots.txt` with sitemap reference | `public/robots.txt` | Done |
| 12 | `sitemap.xml` | `public/sitemap.xml` | Done |
| 13 | `site.webmanifest` (PWA + mobile) | `public/site.webmanifest` | Done |
| 14 | Single-page structure (sab content ek URL par) | `src/App.tsx` | Done |
| 15 | Heading hierarchy: ek `h1`, phir `h2` → `h3` → `h4` | `src/App.tsx` | Done |
| 16 | Email clickable (contact crawlability) | `src/App.tsx` | Done |
| 17 | External project links (entity signals) | `src/App.tsx` | Done |
| 18 | **OG share image 1200×630 PNG** | `public/og-image.png` | Done |
| 19 | **Apple touch icon 180×180 PNG** | `public/apple-touch-icon.png` | Done |
| 20 | **Sitemap `lastmod`** set to today | `public/sitemap.xml` | Done |

---

## Google in cheezon ko IGNORE karta hai — isliye hata diya

| Hata diya | Kyun |
|-----------|------|
| `<meta name="keywords">` | Google ne 2009 mein hi isko ranking ke liye ignore karna shuru kar diya. 29 keywords likhne ka koi fayda nahi. |
| `<meta name="googlebot">` | `robots` meta pehle se `index, follow` bata raha hai. Yeh duplicate tha, sirf tab kaam aata hai jab Google ko rokna ho. |
| `maximum-scale=1` (viewport) | Yeh mobile par pinch-to-zoom block kar deta hai — accessibility problem, aur Google ka mobile-friendly check isko flag karta hai. |

### Kahan yeh keywords ab hain (yeh sahi tareeka hai)

Keywords meta tag hatane ke baad bhi ranking keywords **in** jagah kaam karte hain:

1. **Title tag** — `Kritika Bhagoria | Digital Marketing & AI Creator`
2. **Meta description** — natural language mein primary terms
3. **Page content** — aapke skills, projects, journey ke andar naturally
4. **Headings (`h1`–`h4`)** — AI Prompting, Website Building, Game Development etc.
5. **JSON-LD `knowsAbout`** — 12 skills structured data mein
6. **Project links** — Pizza Ride, Mind Test ke live URLs
7. **Alt text / file names** — image optimization

> Meta keywords tag sirf kuch outdated engines (Bing, Yandex, Baidu) ke liye rakha tha. Hata ke modern approach use kar rahe hain, jo long-term mein behtar hai.

### Jo rakha hai aur REASON hai

| Rakha hai | Kyun zaroori hai |
|-----------|------------------|
| `max-image-preview:large` | Google images ko full size dikhata hai — image traffic badhta hai |
| `max-snippet:-1` | Poora paragraph snippet mein dikhta hai, sirf 160 chars nahi |
| `canonical` | Duplicate content ka signal — wrong URL index hone se rokta hai |
| JSON-LD structured data | Rich Results (star rating, knowledge panel) — Google isko actively favour karta hai |
| Open Graph / Twitter Card | Ranking nahi, par WhatsApp/LinkedIn par link preview achha dikhta hai |
| `preconnect` fonts | LCP (load speed) improve — speed confirmed ranking signal hai |

---

## Target keywords (research ka record — tag nahi, content mein use)

Yeh list planning ke liye hai. Code mein `meta keywords` tag **jaanbujh kar nahi rakha** (Google ignore karta hai). Yeh keywords in jagah naturally daale gaye hain — title, description, headings, content, JSON-LD.

| Priority | Keywords |
|----------|----------|
| Brand | kritika bhagoria |
| Primary | digital marketing, ai creator, ai prompting, prompt engineering |
| AI tools | claude, chatgpt, gemini, ai tools |
| Tech | website building, web development, game development, browser game, video creation |
| Marketing | digital marketer, social media marketing, content creation, copywriting, content strategy |
| Business | freelancer, freelance web developer, business communication, sales mindset, problem solving |
| Long-tail | digital marketing portfolio, ai portfolio |
| Location | pundri, haryana, india |

**Kahan use hua:**
- `kritika bhagoria`, `digital marketing`, `ai creator` → title + description
- `claude, chatgpt, gemini`, `website building`, `game development`, `video creation`, `social media marketing`, `content creation`, `copywriting` → About/Skills content
- `freelancer`, `business communication`, `sales mindset`, `problem solving` → Skills + Contact section
- `pundri, haryana, india` → About, Contact, JSON-LD `address`

---

## Step 1 — Deploy ke baad yeh 3 files update karein (yeh akela kaam bacha hai)

Jab aap live URL decide kar lein (Vercel ka apna domain ya custom domain), yeh **3 files** mein placeholder URL ko apni real URL se replace kar dein:

1. `index.html` — 4 jagah: `canonical`, `og:url`, JSON-LD ke 3 URLs
2. `public/robots.txt` — `Sitemap:` line
3. `public/sitemap.xml` — `<loc>` line

**Search karne ke liye:** `kritika-bhagoria.vercel.app` — sab 8 occurrences mil jayengi.

---

## Step 2 — OG image (DONE)

`public/og-image.png` bana diya gaya hai — 1200 × 630 px, aapke portfolio ke lavender colours mein. Text usme hai:
- **Kritika Bhagoria** (purple `#6f3cc4` accent ke saath)
- Digital Marketing & AI Creator
- AI Prompting · Website Building · Game Development
- Social Media Marketing · Content Creation · Copywriting
- Footer: Portfolio · Pundri, Haryana, India

Jab koi aapka link WhatsApp/LinkedIn/Facebook/X par paste karega, yeh preview dikhega.

**Agar aap design pasand na karein** to Canva par [1200 × 630](https://canva.com) bana kar isi naam se replace kar dein — koi code change nahi karna.

---

## Step 3 — Free mein ranking verify karein (account banana hoga)

Ye teeno accounts main nahi bana sakta (aapki email se verify hote hain), baaki sab set hai:

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console)
   → property add karein → `URL Inspection` → apni live URL submit karein
2. **Bing Webmaster Tools** — [bing.com/webmasters](https://www.bing.com/webmasters)
3. **Google Business Profile** (optional, local business ke liye)

> Note: in accounts ko live URL chahiye, isliye deploy ke baad karein.

---

## Keywords jo target ho rahe hain

**Primary:** digital marketing portfolio, AI creator, AI prompting, website building

**Secondary:** game development, video creation, social media marketing, content creation, copywriting, freelancer Haryana

**Long-tail:** digital marketing portfolio Pundri, AI creator Haryana, freelance website builder India

---

## Content structure (crawler ke liye)

Ek hi page par sab kuch — isse Google ko alag-alag pages banana nahi padta:

```
h1  I am Kritika.
h2  What I do, and where to explore it.
h2  Curiosity with a clear direction.   (About)
h2  Starting with curiosity.             (My journey)
h2  An evolving professional toolkit.    (My skills)
h3    AI & Tech Skills
h4      AI Prompting / Website Building / Game Development ...
h3    Marketing Skills
h3    Business Skills
h2  Built for real-world use.            (My projects)
h2  Let's build something meaningful.    (Contact)
```

---

## Baad mein kar sakte ho (optional)

- [ ] Real photo `PhotoPlaceholder` ki jagah lagayein — photo ranking boost karti hai
- [ ] `PhotoPlaceholder` component ko `img` tag mein badlein (`src/App.tsx`)
- [ ] ek aur project add karein (2 se 3 zyada links = zyada internal credibility)
- [ ] `lastmod` date `public/sitemap.xml` mein content badalne par update karein
