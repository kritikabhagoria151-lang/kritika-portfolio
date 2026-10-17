/**
 * Blog Post Generator - Kritika Bhagoria portfolio
 * Uses the Gemini REST API directly (no npm dependencies, Node 18+ global fetch).
 *
 * Usage:
 *   node scripts/generate-blog-post.js [topic] [forcePublish]
 *
 *   topic        optional - a topic key or words to match (e.g. "SEO", "Pizza Ride")
 *   forcePublish optional - "true" publishes immediately, otherwise draft
 *
 * Env:
 *   GEMINI_API_KEY  required - read from GitHub Secrets, never hardcoded.
 *   GITHUB_OUTPUT   optional - GitHub Actions output file.
 *   DRY_RUN         optional - set to "1" to print the post without writing the file.
 */

import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = process.cwd();
const BLOG_POSTS_FILE = path.join(APP_DIR, 'blog-posts.json');
const COVER_IMAGE = '/kritika-bhagoria-blog-cover.png';

const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
const API_BASE =
  process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Topic rotation pool. `tags` are used to detect whether a topic was already
 * covered by an existing published/draft post.
 */
const TOPICS = [
  {
    key: 'seo-local',
    category: 'SEO',
    tags: ['seo', 'local'],
    title: 'Local SEO Basics for Small Businesses',
    focus: 'How a small service business can show up in local search using its Google Business Profile, clear page titles and honest, useful content.',
  },
  {
    key: 'seo-technical',
    category: 'SEO',
    tags: ['technical seo', 'checklist'],
    title: 'A Simple Technical SEO Checklist Before You Launch a Website',
    focus: 'Sitemap, robots.txt, page titles, meta descriptions, image alt text, mobile layout and page speed - explained in plain language.',
  },
  {
    key: 'seo-keywords',
    category: 'SEO',
    tags: ['keyword research'],
    title: 'How I Think About Keyword Research as a Beginner',
    focus: 'Finding words real people type, judging search intent, and picking topics that are realistic for a new site to rank for.',
  },
  {
    key: 'ai-website',
    category: 'AI Tools',
    tags: ['ai workflow', 'building websites'],
    title: 'How I Build a Website with AI, Step by Step',
    focus: 'The workflow: writing a clear brief, prompting for layout, reviewing generated code, fixing accessibility and SEO by hand, then deploying.',
  },
  {
    key: 'ai-prompts',
    category: 'AI Tools',
    tags: ['prompting', 'prompt'],
    title: 'Prompting Tips That Help Me Get Better AI Output',
    focus: 'Being specific, giving context and examples, asking for structure, and iterating instead of expecting a perfect first answer.',
  },
  {
    key: 'ai-honest-limits',
    category: 'AI Tools',
    tags: ['ai limits', 'mistakes'],
    title: 'Where AI Still Needs Me: Limits I Keep Running Into',
    focus: 'AI writes fast but can invent details, miss accessibility, and repeat itself - how I check its work before shipping.',
  },
  {
    key: 'pizza-ride',
    category: 'Project Case Study',
    tags: ['pizza ride'],
    title: 'What I Learned Building the Pizza Ride Ordering Website',
    focus: 'Planning a simple ordering flow, keeping the menu easy to update, and using a WhatsApp checkout to reduce steps for customers.',
  },
  {
    key: 'mind-test',
    category: 'Project Case Study',
    tags: ['mind test', 'game'],
    title: 'What I Learned Building Mind Test, a Browser Quiz Game',
    focus: 'Keeping a small game fun, handling wrong answers kindly, and testing on a phone before calling it finished.',
  },
  {
    key: 'geo-aeo',
    category: 'GEO/AEO',
    tags: ['geo', 'aeo', 'generative engine'],
    title: 'GEO and AEO Explained in Simple Words',
    focus: 'Why answer-first writing, clear headings, FAQ sections and structured data help AI assistants understand and quote a page.',
  },
  {
    key: 'geo-schema',
    category: 'GEO/AEO',
    tags: ['schema', 'structured data'],
    title: 'Structured Data Basics for Beginners',
    focus: 'What schema markup does, which types are useful for a personal site, and how to validate it.',
  },
  {
    key: 'social-repurpose',
    category: 'Social Media Marketing',
    tags: ['social media', 'repurposing'],
    title: 'One Blog Post, Several Social Media Posts',
    focus: 'Breaking a longer article into short posts for LinkedIn, Instagram and X without repeating the same sentence everywhere.',
  },
  {
    key: 'social-consistency',
    category: 'Social Media Marketing',
    tags: ['social media', 'consistency'],
    title: 'Posting Consistently When You Have No Big Audience',
    focus: 'Choosing one or two platforms, planning a simple weekly rhythm, and measuring replies instead of follower counts.',
  },
  {
    key: 'marketing-basics',
    category: 'Marketing',
    tags: ['digital marketing', 'marketing basics'],
    title: 'Digital Marketing Skills I Am Learning First',
    focus: 'Why writing, audience research and basic analytics matter before paid ads, and how coursework connects to real practice.',
  },
  {
    key: 'learning-journey',
    category: 'Learning Journey',
    tags: ['learning journey', 'beginnings'],
    title: 'How I Started Learning Digital Marketing and AI',
    focus: 'The honest beginning: school marks that were not impressive, choosing a direction, and learning by building real projects.',
  },
  {
    key: 'learning-mistakes',
    category: 'Learning Journey',
    tags: ['mistakes', 'lessons'],
    title: 'Mistakes I Made in My First Year of Learning Online',
    focus: 'Starting too many things, copying others instead of practising, and how keeping a small finished project changed my progress.',
  },
];

function loadBlogData() {
  try {
    const raw = fs.readFileSync(BLOG_POSTS_FILE, 'utf-8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch (error) {
    console.log(`Could not read blog-posts.json (${error.message}). Starting fresh.`);
    return { AUTO_PUBLISH: false, posts: [] };
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
}

function wordsOf(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function isTopicUsed(topic, posts) {
  return posts.some((post) => {
    const haystack = `${post.title || ''} ${post.category || ''} ${post.slug || ''}`.toLowerCase();
    return topic.tags.some((tag) => haystack.includes(tag));
  });
}

function pickTopic(posts, requested) {
  if (requested) {
    const needle = requested.toLowerCase().trim();
    const match = TOPICS.find(
      (topic) =>
        topic.key === needle ||
        topic.tags.some((tag) => tag.includes(needle) || needle.includes(tag)) ||
        topic.title.toLowerCase().includes(needle),
    );
    if (match) return match;
    console.log(`No preset topic matched "${requested}" - writing a custom post on that subject.`);
    return {
      key: slugify(requested) || 'custom-topic',
      category: 'Digital Marketing',
      tags: [needle],
      title: requested,
      focus: `A practical, first-person post about ${requested}.`,
    };
  }

  const unused = TOPICS.filter((topic) => !isTopicUsed(topic, posts));
  const pool = unused.length > 0 ? unused : TOPICS;
  if (unused.length === 0) {
    console.log('All preset topics look used - picking one at random to refresh.');
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildPrompt(topic, today) {
  return `You write the personal blog for Kritika Bhagoria, a digital marketing student and AI creator from Pundri, Haryana, India.

Write ONE blog post about: ${topic.title}
Angle to cover: ${topic.focus}

Voice and rules:
- First person, warm, simple English. Short sentences. No corporate jargon.
- She is a student who is still learning. Never claim expert-level authority or years of experience.
- NEVER invent statistics, percentages, revenue numbers, client results, testimonials, awards, or studies. No made-up data of any kind.
- Only mention real things: her own projects (the Pizza Ride ordering website, the Mind Test browser quiz game), her coursework in digital marketing with AI, and general well-known practice.
- No emojis. No markdown. No em dashes. Use plain hyphens if needed.
- 400 to 600 words of body text.
- Use 2 to 3 <h2> headings, <p> paragraphs, and optionally a <ul> with <li> items.
- The article must end with a short closing paragraph, not a call to action.
- Today's date is ${today}. Do not contradict it.

Return ONLY JSON (no code fences, no commentary) in exactly this shape:
{
  "title": "Post title, under 65 characters",
  "excerpt": "One sentence summary, 120 to 155 characters",
  "category": "${topic.category}",
  "content": "<h2>...</h2><p>...</p>",
  "readTime": "X min"
}`;
}

async function callGemini(apiKey, prompt) {
  let lastError = 'unknown error';

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Asking Gemini model: ${model}`);
      const response = await fetch(`${API_BASE}/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2400,
            responseMimeType: 'application/json',
          },
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        lastError = `HTTP ${response.status}: ${payload?.error?.message || response.statusText}`;
        console.log(`  ${model} failed - ${lastError}`);
        continue;
      }

      const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || '';
      if (!text.trim()) {
        lastError = 'empty response';
        console.log(`  ${model} returned an empty response`);
        continue;
      }
      return text;
    } catch (error) {
      lastError = error.message;
      console.log(`  ${model} threw - ${lastError}`);
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError}`);
}

function parsePost(raw, topic, today) {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Response did not contain a JSON object');
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  if (!parsed.title || !parsed.content || !parsed.excerpt) {
    throw new Error('Response is missing title, excerpt or content');
  }

  const content = String(parsed.content).trim();
  const wordCount = wordsOf(content).length;

  if (wordCount < 350 || wordCount > 700) {
    throw new Error(`Word count ${wordCount} is outside the 400-600 target range`);
  }

  if (!/<h2/i.test(content)) {
    throw new Error('Post is missing h2 headings');
  }

  return {
    title: String(parsed.title).trim(),
    excerpt: String(parsed.excerpt).trim(),
    category: String(parsed.category || topic.category).trim(),
    content,
    wordCount,
    readTime: `${Math.max(2, Math.round(wordCount / 200))} min`,
    topicKey: topic.key,
    date: today,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const requestedTopic = (args[0] || '').trim();
  const forcePublish = (args[1] || '').toLowerCase() === 'true';
  const dryRun = process.env.DRY_RUN === '1';

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set. Add it under GitHub repo Settings > Secrets and variables > Actions.');
    process.exit(1);
  }

  const blogData = loadBlogData();
  const posts = Array.isArray(blogData.posts) ? blogData.posts : [];
  const autoPublish = blogData.AUTO_PUBLISH === true || forcePublish;

  const today = new Date().toISOString().split('T')[0];
  const topic = pickTopic(posts, requestedTopic);
  console.log(`Topic    : ${topic.title} [${topic.category}]`);
  console.log(`Publish  : ${autoPublish ? 'yes (AUTO_PUBLISH/override)' : 'no (draft for review)'}`);

  let post = null;
  let lastError = '';
  for (let attempt = 1; attempt <= 3 && !post; attempt++) {
    try {
      const raw = await callGemini(apiKey, buildPrompt(topic, today));
      post = parsePost(raw, topic, today);
    } catch (error) {
      lastError = error.message;
      console.log(`Attempt ${attempt} rejected - ${lastError}`);
    }
  }

  if (!post) {
    console.error(`Could not produce a valid post. Last problem: ${lastError}`);
    process.exit(1);
  }

  const existingSlugs = new Set(posts.map((item) => item.slug));
  let slug = slugify(post.title);
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${slugify(post.title)}-${suffix}`;
    suffix += 1;
    if (suffix > 50) throw new Error('Could not find a unique slug');
  }

  const duplicate = posts.find(
    (item) => String(item.title).trim().toLowerCase() === post.title.toLowerCase(),
  );
  if (duplicate) {
    console.error(`A post with this title already exists (${duplicate.slug}). Nothing added.`);
    process.exit(0);
  }

  const newPost = {
    id: slug,
    slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover: COVER_IMAGE,
    category: post.category,
    date: post.date,
    readTime: post.readTime,
    published: autoPublish,
    topicKey: post.topicKey,
  };

  console.log(`\nTitle    : ${newPost.title}`);
  console.log(`Slug     : ${newPost.slug}`);
  console.log(`Words    : ${post.wordCount}`);
  console.log(`Category : ${newPost.category}`);
  console.log(`Published: ${newPost.published}`);

  if (dryRun) {
    console.log('\nDRY_RUN=1 - file not modified.');
    return;
  }

  const updated = {
    AUTO_PUBLISH: blogData.AUTO_PUBLISH === true,
    posts: [newPost, ...posts],
  };

  fs.writeFileSync(BLOG_POSTS_FILE, `${JSON.stringify(updated, null, 2)}\n`, { encoding: 'utf8' });
  console.log(`\nSaved to ${BLOG_POSTS_FILE}`);

  if (process.env.GITHUB_OUTPUT) {
    const onOneLine = (value) => String(value).replace(/[\r\n]+/g, ' ').trim();
    const outputs = [
      `post-title=${onOneLine(newPost.title)}`,
      `post-slug=${onOneLine(newPost.slug)}`,
      `post-category=${onOneLine(newPost.category)}`,
      `post-date=${onOneLine(newPost.date)}`,
      `post-published=${newPost.published}`,
      `post-words=${post.wordCount}`,
    ].join('\n');
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${outputs}\n`);
  }
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
