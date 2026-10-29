/**
 * Prerender script for blog pages.
 *
 * Generates static HTML files for:
 *   - /blog          (blog list page)
 *   /blog/{slug}     (individual post pages)
 *
 * These files contain full SEO metadata (<title>, <meta description>,
 * <link rel="canonical">, OG/Twitter tags) and real <a href="/blog/slug">
 * links, so Google can crawl them without JavaScript.
 *
 * Runs automatically after `vite build` via the npm `postbuild` script.
 * Output is written as UTF-8 without BOM.
 */

import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = process.cwd();
const DIST_DIR = path.join(APP_DIR, 'dist', 'public');
const BLOG_DATA_FILE = path.join(APP_DIR, 'public', 'blog-posts.json');
const SITE_URL = 'https://kritikabhagoria-portfolio.vercel.app';

function readAssetUrls() {
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  const cssMatch = indexHtml.match(/<link[^>]+href="([^"]*assets[^"]*\.css)"/);
  const jsMatch = indexHtml.match(/<script[^>]+src="([^"]*assets[^"]*\.js)"/);
  return {
    css: cssMatch ? cssMatch[1] : '/assets/index.css',
    js: jsMatch ? jsMatch[1] : '/assets/index.js',
  };
}

function loadBlogPosts() {
  const raw = fs.readFileSync(BLOG_DATA_FILE, 'utf-8').replace(/^\uFEFF/, '');
  const data = JSON.parse(raw);
  return (data.posts || []).filter((p) => p.published === true && p.slug);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function headHtml(title, description, canonicalUrl, ogImage, assets) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Kritika Bhagoria" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="512x512" href="/kb-logo.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${escapeHtml(assets.css)}" />
  <style>
    /* Reveal animation only hides elements when JS has loaded.
       Without JS, .reveal elements stay visible (opacity 1). */
    html.js-enabled .reveal { opacity: 0; }
  </style>
</head>
<body>
<script>
  document.documentElement.classList.add('js-enabled');
</script>`;
}

function footHtml(assets) {
  return `<script src="${escapeHtml(assets.js)}"></script>
</body>
</html>`;
}

function navLinksHtml() {
  return `<nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
    <a href="/" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-home">Home</a>
    <a href="/#about" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-about">About</a>
    <a href="/#journey" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-journey">Journey</a>
    <a href="/#skills" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-skills">Skills</a>
    <a href="/#projects" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-projects">Projects</a>
    <a href="/blog" class="focus-ring text-[13px] font-semibold transition-colors text-[#6f3cc4]" data-testid="link-nav-blog">Blog</a>
    <a href="/#contact" class="focus-ring text-[13px] font-semibold transition-colors text-[#665b77] hover:text-[#6f3cc4]" data-testid="link-nav-contact">Contact</a>
  </nav>`;
}

function shellStartHtml() {
  return `<div class="noise min-h-[100dvh] overflow-hidden">
  <header class="fixed inset-x-0 top-0 z-40 border-b border-violet-200/70 bg-[#fbf9ff]/85 backdrop-blur-xl">
    <div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
      <a href="/" class="focus-ring flex items-center gap-2" data-testid="link-home">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-[#6f3cc4] font-display text-sm font-bold text-white shadow-[0_8px_20px_-8px_#6f3cc4]">KB</span>
        <span class="font-display text-lg font-semibold tracking-tight text-[#33264e]">Kritika<span class="text-[#8050ce]">.</span></span>
      </a>
      ${navLinksHtml()}
      <a href="#contact" class="focus-ring hidden rounded-full bg-[#33264e] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#6f3cc4] sm:inline-flex" data-testid="link-header-contact">
        Let's connect <svg class="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3M4 15h22M4 15l7 7m0 0l7-7m-7 7v-8"></path></svg>
      </a>
      <button type="button" aria-label="Toggle menu" class="focus-ring rounded-lg p-2 text-[#33264e] md:hidden" data-testid="button-mobile-menu">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>
  </header>

  <main class="pt-[72px]">`;
}

function shellEndHtml() {
  return `  </main>
  <footer class="border-t border-violet-100 bg-[#fbf9ff] px-5 py-8 sm:px-8 lg:px-12">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#806f99] sm:flex-row sm:items-center sm:justify-between">
      <a href="/" class="font-display font-semibold text-[#45315e]" data-testid="link-footer-home">
        Kritika<span class="text-[#8050ce]">.</span>
      </a>
      <span>Digital marketing. AI-assisted development. Content that performs.</span>
      <a href="#contact" class="focus-ring inline-flex items-center gap-2 font-semibold text-[#6f3cc4]" data-testid="link-footer-contact">
        Let's connect <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3M4 15h22M4 15l7 7m0 0l7-7m-7 7v-8"></path></svg>
      </a>
    </div>
  </footer>
</div>`;
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Missing ${DIST_DIR}. Run build first.`);
    process.exit(1);
  }

  const assets = readAssetUrls();
  const allPosts = loadBlogPosts();

  // Sort posts by date descending (newest first)
  allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Ensure blog directory exists
  const blogDir = path.join(DIST_DIR, 'blog');
  fs.mkdirSync(blogDir, { recursive: true });

  // ---- Blog list page (/blog) ----
  const listTitle = 'Blog | Kritika Bhagoria';
  const listDescription = 'Practical notes on SEO, AI tools, and digital marketing from building websites, games, and content with AI.';
  const listCanonical = `${SITE_URL}/blog`;
  const listOgImage = `${SITE_URL}/kritika-bhagoria-blog-cover.webp`;

  const postsListHtml = allPosts.map((post) => `
    <article class="group rounded-[2rem] border border-violet-100 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-28px_#5f378e]">
      <div class="aspect-video overflow-hidden bg-[#eee7fa]">
        <img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.title)} - Kritika Bhagoria blog cover on SEO, AI tools and digital marketing" width="1200" height="630" loading="lazy" decoding="async" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3 text-xs text-[#806f99]">
          <time dateTime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
          <span class="w-px h-4 bg-violet-200"></span>
          <span>${escapeHtml(post.readTime)} read</span>
        </div>
        <span class="mt-3 inline-block rounded-full bg-[#f6f1ff] px-3 py-1 text-xs font-bold uppercase tracking-[.1em] text-[#8050ce]">${escapeHtml(post.category)}</span>
        <h3 class="mt-4 font-display text-2xl font-semibold tracking-tight text-[#33264e] group-hover:text-[#6f3cc4] transition-colors">${escapeHtml(post.title)}</h3>
        <p class="mt-3 text-sm leading-7 text-[#746783] line-clamp-3">${escapeHtml(post.excerpt)}</p>
        <a href="/blog/${escapeHtml(post.slug)}" class="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f3cc4] transition-all hover:gap-3" data-testid="link-blog-${escapeHtml(post.id)}">
          Read more <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </a>
      </div>
    </article>
  `).join('');

  const listHtml = `${headHtml(listTitle, listDescription, listCanonical, listOgImage, assets)}
${shellStartHtml()}
<section class="px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
  <div class="mx-auto max-w-7xl">
    <div class="mt-10">
      <div class="flex items-center gap-3 text-xs text-[#806f99]">
        <span class="mt-3 inline-block rounded-full bg-[#f6f1ff] px-3 py-1 text-xs font-bold uppercase tracking-[.1em] text-[#8050ce]">Blog</span>
      </div>
      <h1 class="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.1] tracking-[-.04em] text-[#33264e]">Ideas, lessons,<br><span class="text-[#6f3cc4]">and experiments.</span></h1>
      <p class="mt-8 max-w-2xl text-lg leading-8 text-[#746783]">Things I am learning while building, marketing, and growing with AI. Practical notes, not theory.</p>
    </div>

    <div class="mx-auto mt-16 max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      ${postsListHtml}
    </div>

    <div class="mt-16 text-center">
      <p class="text-sm text-[#806f99]">More posts coming soon - subscribe to stay updated.</p>
    </div>
  </div>
</section>
${shellEndHtml()}
${footHtml(assets)}`;

  fs.writeFileSync(path.join(blogDir, 'index.html'), listHtml, { encoding: 'utf8' });
  console.log(`Generated: dist/public/blog/index.html`);

  // ---- Individual post pages (/blog/{slug}) ----
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    const prevPost = i > 0 ? allPosts[i - 1] : null;
    const nextPost = i < allPosts.length - 1 ? allPosts[i + 1] : null;

    const postDir = path.join(blogDir, post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    const postTitle = `${post.title} | Kritika Bhagoria`;
    const postDescription = post.excerpt;
    const postCanonical = `${SITE_URL}/blog/${post.slug}`;
    const postOgImage = `${SITE_URL}${post.cover.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;

    const prevLink = prevPost
      ? `<a href="/blog/${escapeHtml(prevPost.slug)}" class="focus-ring flex-1 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee]"><svg class="h-4 w-4 -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Previous</a>`
      : '';
    const nextLink = nextPost
      ? `<a href="/blog/${escapeHtml(nextPost.slug)}" class="focus-ring flex-1 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee]">Next <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>`
      : '';

    const postHtml = `${headHtml(postTitle, postDescription, postCanonical, postOgImage, assets)}
${shellStartHtml()}
<section class="px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
  <div class="mx-auto max-w-3xl">
    <button type="button" class="focus-ring inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee]" data-testid="link-blog-post-back">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Back to blog
    </button>

    <header class="mt-10">
      <div class="flex items-center gap-3 text-xs text-[#806f99]">
        <time dateTime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        <span class="w-px h-4 bg-violet-200"></span>
        <span>${escapeHtml(post.readTime)} read</span>
      </div>
      <span class="mt-3 inline-block rounded-full bg-[#f6f1ff] px-3 py-1 text-xs font-bold uppercase tracking-[.1em] text-[#8050ce]">${escapeHtml(post.category)}</span>
      <h1 class="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.1] tracking-[-.04em] text-[#33264e]">${escapeHtml(post.title)}</h1>
    </header>

    <div class="mt-8 aspect-video overflow-hidden bg-[#eee7fa] rounded-[2rem]">
      <img src="${escapeHtml(post.cover)}" alt="${escapeHtml(post.title)} - article cover image by Kritika Bhagoria" width="1200" height="630" loading="eager" fetchPriority="high" decoding="async" class="h-full w-full object-cover">
    </div>

    <div class="mt-10 prose prose-purple max-w-none">
      ${post.content}
    </div>

    <nav class="mt-16 flex items-center justify-between gap-4 border-t border-violet-100 pt-8">
      ${prevLink}
      ${nextLink}
    </nav>

    <div class="mt-16 text-center">
      <p class="text-sm text-[#806f99]">Found this useful? Share it with someone who's building with AI.</p>
      <div class="mt-4 flex items-center justify-center gap-3">
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postCanonical)}" target="_blank" rel="noreferrer" class="focus-ring inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-colors hover:border-[#cbb8ee]">Share on X</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postCanonical)}" target="_blank" rel="noreferrer" class="focus-ring inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-colors hover:border-[#cbb8ee]">Share on LinkedIn</a>
      </div>
    </div>
  </div>
</section>
${shellEndHtml()}
${footHtml(assets)}`;

    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, { encoding: 'utf8' });
    console.log(`Generated: dist/public/blog/${post.slug}/index.html`);
  }

  console.log('Prerender complete.');
}

main().catch((error) => {
  console.error(`Prerender failed: ${error.message}`);
  process.exit(1);
});
