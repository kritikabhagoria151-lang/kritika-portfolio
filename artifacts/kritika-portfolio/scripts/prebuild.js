/**
 * Pre-build step.
 *
 *  1. Generates public/sitemap.xml from the published blog posts.
 *  2. Copies the blog data to public/ so the site can fetch it at runtime.
 *
 * Runs automatically before `vite build` via the npm `prebuild` script.
 */

import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = process.cwd();
const BLOG_SOURCE = path.join(APP_DIR, 'blog-posts.json');
const BLOG_DEST = path.join(APP_DIR, 'public', 'blog-posts.json');

async function main() {
  if (!fs.existsSync(BLOG_SOURCE)) {
    console.error(`Missing ${BLOG_SOURCE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(BLOG_SOURCE, 'utf-8').replace(/^\uFEFF/, '');
  const data = JSON.parse(raw);
  const all = Array.isArray(data.posts) ? data.posts : [];
  const published = all.filter((post) => post.published === true);

  const publicData = {
    AUTO_PUBLISH: data.AUTO_PUBLISH === true,
    posts: published,
  };

  fs.writeFileSync(BLOG_DEST, `${JSON.stringify(publicData, null, 2)}\n`, { encoding: 'utf8' });
  console.log(
    `Blog data -> ${BLOG_DEST} (${published.length} published, ${all.length - published.length} draft hidden)`,
  );

  await import('./generate-sitemap.js');
  console.log('Pre-build complete.');
}

main().catch((error) => {
  console.error(`Pre-build failed: ${error.message}`);
  process.exit(1);
});
