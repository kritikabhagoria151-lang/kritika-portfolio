/**
 * Sitemap generator for the Kritika Bhagoria portfolio.
 *
 * Merges the existing public/sitemap.xml with the blog posts found in
 * blog-posts.json:
 *   - existing entries (including the image sitemap blocks) are kept as-is,
 *   - entries for blog posts that are no longer published are removed,
 *   - published blog posts get a fresh <url> entry.
 *
 * Output is written as UTF-8 without BOM.
 */

import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://kritikabhagoria-portfolio.vercel.app';
const BLOG_DATA_FILE = path.join(process.cwd(), 'blog-posts.json');
const SITEMAP_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

function loadPublishedPosts() {
  try {
    const raw = fs.readFileSync(BLOG_DATA_FILE, 'utf-8').replace(/^\uFEFF/, '');
    const data = JSON.parse(raw);
    return (data.posts || []).filter((post) => post.published === true && post.slug);
  } catch (error) {
    console.log(`Could not read blog-posts.json (${error.message}) - only existing entries will be kept.`);
    return [];
  }
}

function extractEntries(xml) {
  const matches = xml.match(/^([ \t]*)<url>[\s\S]*?<\/url>/gm) || [];
  return matches.map((block) => {
    const lines = block.split('\n').filter((line) => line.trim() !== '');
    const base = Math.min(...lines.map((line) => (line.match(/^[ \t]*/) || [''])[0].length));
    return lines.map((line) => `  ${line.slice(base)}`).join('\n');
  });
}

function locOf(entry) {
  const match = entry.match(/<loc>([^<]+)<\/loc>/);
  return match ? match[1].trim() : '';
}

function blogEntry(post) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}/blog/${post.slug}</loc>`,
    `    <lastmod>${post.date || new Date().toISOString().split('T')[0]}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.8</priority>',
    '  </url>',
  ].join('\n');
}

function buildSitemap() {
  let existingXml = '';
  try {
    existingXml = fs.readFileSync(SITEMAP_FILE, 'utf-8');
  } catch {
    existingXml = '';
  }

  const staticEntries = extractEntries(existingXml).filter((entry) => {
    const loc = locOf(entry);
    return loc && !/\/blog\/.+/.test(loc);
  });

  const posts = loadPublishedPosts();
  const entries = [...staticEntries, ...posts.map(blogEntry)];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(SITEMAP_FILE, xml, { encoding: 'utf8' });
  console.log(`Sitemap written: ${SITEMAP_FILE}`);
  console.log(`  static/page entries kept: ${staticEntries.length}`);
  console.log(`  published blog posts    : ${posts.length}`);
}

buildSitemap();
