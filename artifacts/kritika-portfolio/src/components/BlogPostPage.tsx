import { useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';

interface BlogPostPageProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export function BlogPostPage({ post, allPosts }: BlogPostPageProps) {
  useEffect(() => {
    document.title = `${post.title} | Kritika Bhagoria`;
    
    // Update meta tags
    const updateMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    const canonicalUrl = `${window.location.origin}/blog/${post.slug}`;
    updateMeta('name', 'description', post.excerpt);
    updateMeta('property', 'og:title', post.title);
    updateMeta('property', 'og:description', post.excerpt);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:image', `${window.location.origin}${post.cover}`);
    updateMeta('name', 'twitter:title', post.title);
    updateMeta('name', 'twitter:description', post.excerpt);
    
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [post]);

  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <article className="px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee]"
          data-testid="link-blog-post-back"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </button>

        <header className="mt-10">
          <div className="flex items-center gap-3 text-xs text-[#806f99]">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </time>
            <span className="w-px h-4 bg-violet-200" />
            <span>{post.readTime} read</span>
          </div>
          <span className="mt-3 inline-block rounded-full bg-[#f6f1ff] px-3 py-1 text-xs font-bold uppercase tracking-[.1em] text-[#8050ce]">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.1] tracking-[-.04em] text-[#33264e]">
            {post.title}
          </h1>
        </header>

        <div className="mt-8 aspect-video overflow-hidden bg-[#eee7fa] rounded-[2rem]">
          <img
            src={post.cover}
            alt={`${post.title} - article cover image by Kritika Bhagoria`}
            width={1200}
            height={630}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-10 prose prose-purple max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-violet-100 pt-8">
          {prevPost && (
            <a
              href={`/blog/${prevPost.slug}`}
              className="focus-ring flex-1 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee]"
            >
              <ChevronRight className="-rotate-90 h-4 w-4" />
              Previous
            </a>
          )}
          {nextPost && (
            <a
              href={`/blog/${nextPost.slug}`}
              className="focus-ring flex-1 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-[#6f3cc4] transition-all hover:-translate-y-0.5 hover:border-[#cbb8ee] ml-auto"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </a>
          )}
        </nav>

        <section className="mt-16 rounded-[2rem] border border-violet-100 bg-[#faf8ff] p-6 sm:p-9">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">Related posts</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#33264e]">Keep reading</h2>
            </div>
            <a
              href="/blog"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#6f3cc4] px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#57309f]"
            >
              Back to all posts <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {(allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)).map((related) => (
              <article
                key={related.id}
                className="group rounded-[1.5rem] border border-violet-100 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-28px_#5f378e]"
              >
                <div className="aspect-video overflow-hidden bg-[#eee7fa]">
                  <picture>
                    <source srcSet={related.cover.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
                    <img
                      src={related.cover}
                      alt={`${related.title} - Kritika Bhagoria blog cover`}
                      width={1200}
                      height={630}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </picture>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[#806f99]">
                    <time dateTime={related.date}>
                      {new Date(related.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                    <span className="w-px h-4 bg-violet-200" />
                    <span>{related.readTime} read</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[#33264e] group-hover:text-[#6f3cc4] transition-colors">
                    {related.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#746783] line-clamp-2">{related.excerpt}</p>
                  <a
                    href={`/blog/${related.slug}`}
                    className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#6f3cc4] transition-all hover:gap-3"
                  >
                    Read more <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#806f99]">Found this useful? Share it with someone who's building with AI.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${window.location.origin}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-colors hover:border-[#cbb8ee]"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-semibold text-[#6f3cc4] transition-colors hover:border-[#cbb8ee]"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}