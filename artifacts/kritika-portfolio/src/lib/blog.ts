export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
}

export interface BlogData {
  AUTO_PUBLISH: boolean;
  posts: BlogPost[];
}

let blogDataCache: BlogData | null = null;

export async function loadBlogData(): Promise<BlogData> {
  if (blogDataCache) return blogDataCache;
  
  try {
    const response = await fetch('/blog-posts.json');
    if (!response.ok) {
      throw new Error('Failed to load blog posts');
    }
    const data = await response.json();
    blogDataCache = data;
    return data;
  } catch (error) {
    console.error('Error loading blog data:', error);
    return { AUTO_PUBLISH: false, posts: [] };
  }
}

export function getPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.published);
}

export function getPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find(post => post.slug === slug && post.published);
}

export function getAllPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.published).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function generateSitemapEntries(posts: BlogPost[], baseUrl: string): string {
  const publishedPosts = getPublishedPosts(posts);
  const urls = publishedPosts.map(post => {
    const lastmod = post.date;
    return `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });
  
  return urls.join('\n');
}