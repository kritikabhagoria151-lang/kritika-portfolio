# blog-automation

Har Mon, Wed aur Fri subah 9 baje (IST) ye system Gemini se ek naya blog post
likhta hai aur use **Blogger ke secret posting email address** par bhej deta hai -
aapko sirf Blogger dashboard mein post approve karna hota hai.

Har run mein alag topic aata hai (digital marketing, SEO, web development, AI tips)
aur post mein 1-2 jagah portfolio link `https://kritikabhagoria-portfolio.vercel.app/`
natural tarah se judta hai.

## Files

| File | Kaam |
| --- | --- |
| `post_blog.py` | Gemini se post likhwayi aur Gmail SMTP (smtp.gmail.com:465) se Blogger ko email |
| `requirements.txt` | Python packages (`requests`) |
| `../.github/workflows/blog.yml` | GitHub Actions - schedule + manual "Run workflow" button |
| `.gitignore` | `.env`, secrets aur Python junk ko commit hone se rokta hai |

> **Note:** workflow file `blog-automation/` ke andar nahi hai. GitHub sirf repo ke
> root par `.github/workflows/` padhta hai, isliye `blog.yml` wahin rakha hai.

## 1. GitHub Secrets (4)

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Kya daalna hai |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio ka API key (`aistudio.google.com/apikey`) |
| `GMAIL_ADDRESS` | Wo Gmail address jisse post bhejni hai |
| `GMAIL_APP_PASSWORD` | Gmail ka 16-character App Password |
| `BLOGGER_EMAIL` | Blogger ka secret posting address (jaise `xyz123@blogger.com`) |

**Gmail App Password banane ke liye:** Google Account → Security → 2-Step
Verification ON → App passwords → "Mail" → jo 16-char code mile wo
`GMAIL_APP_PASSWORD` mein.

**Blogger ka email address:** Blogger → Settings → Email → *Posting from email*
→ secret address copy kar lein.

## 2. Chalana

Automatically: schedule Mon/Wed/Fri 09:00 IST (03:30 UTC).

Manually: **Actions → Blog to Blogger → Run workflow** → (optional) topic bhar ke
**Run workflow**.

Locally test karna:

```bash
cd blog-automation
python -m venv .venv && .venv\Scripts\activate      # Windows
pip install -r requirements.txt
setx GEMINI_API_KEY "..."                           # ek baar, phir terminal restart
setx GMAIL_ADDRESS "..."
setx GMAIL_APP_PASSWORD "..."
setx BLOGGER_EMAIL "..."
python post_blog.py
```

`.env` file bana kar bhi chala sakte hain (wo `.gitignore` mein hai, kabhi commit
nahi hogi) - lekin GitHub par sirf Secrets use hote hain, kuch bhi code mein
hardcode nahi hota.
