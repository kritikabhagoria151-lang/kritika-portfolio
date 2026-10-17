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

  fs.copyFileSync(BLOG_SOURCE, BLOG_DEST);
  console.log(`Copied blog data -> ${BLOG_DEST}`);

  await import('./generate-sitemap.js');
  console.log('Pre-build complete.');
}

main().catch((error) => {
  console.error(`Pre-build failed: ${error.message}`);
  process.exit(1);
});
