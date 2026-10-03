import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  Cpu,
  ExternalLink,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Music,
  Palette,
  Plane,
  Sparkles,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';

const skillGroups = [
  {
    id: 'tech',
    title: 'AI & Tech Skills',
    icon: Cpu,
    accent: '#8b6ad9',
    accentBorder: '#e0d3f7',
    items: [
      {
        name: 'AI Prompting',
        level: 'Advanced',
        description: 'Crafting precise, structured instructions for Claude, ChatGPT, and Gemini to get reliable, high-quality output on the first attempt.',
      },
      {
        name: 'Website Building',
        level: 'Intermediate',
        description: 'Building complete, responsive websites end to end with AI tooling — layout, styling, logic, and deployment. Verified by the live Pizza Ride project.',
        proof: 'Pizza Ride',
      },
      {
        name: 'Game Development',
        level: 'Intermediate',
        description: 'Creating playable browser-based games with AI assistance — game logic, scoring, and an interactive user interface.',
        proof: 'Mind Test',
      },
      {
        name: 'Video Creation',
        level: 'Intermediate',
        description: 'Producing professional-quality video content using AI tools, covering scripting, editing, and post-production.',
      },
      {
        name: '30+ AI Tools',
        level: 'Working Knowledge',
        description: 'Hands-on experience with 30+ AI tools including Midjourney, Canva AI, HeyGen, ElevenLabs, and more across design, video, audio, and content workflows.',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Skills',
    icon: Megaphone,
    accent: '#8b6ad9',
    accentBorder: '#e0d3f7',
    items: [
      {
        name: 'Digital Marketing',
        level: 'Intermediate',
        description: 'Growing online brands through structured campaigns, audience targeting, and performance tracking across digital channels.',
        proof: 'Course',
      },
      {
        name: 'Social Media Marketing',
        level: 'Intermediate',
        description: 'Planning and publishing content for Instagram, Facebook, and LinkedIn with platform-specific strategies and consistent posting schedules.',
      },
      {
        name: 'Content Creation',
        level: 'Intermediate',
        description: 'Producing posts, reels, and captions that stop the scroll and communicate a clear message to the target audience.',
      },
      {
        name: 'Copywriting',
        level: 'Developing',
        description: 'Writing persuasive, sales-focused copy for headlines, product pages, ads, and email campaigns that converts attention into action.',
      },
      {
        name: 'SEO',
        level: 'Intermediate',
        description: 'Optimising websites for search engines with keyword research, on-page SEO, meta tags, structured data, and technical fixes to improve organic visibility.',
        proof: 'Course',
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Skills',
    icon: Briefcase,
    accent: '#8b6ad9',
    accentBorder: '#e0d3f7',
    items: [
      {
        name: 'Communication',
        level: 'Advanced',
        description: 'Confident, professional communication in Hindi, English, and Hinglish — adapting tone and clarity to suit the audience.',
      },
      {
        name: 'Sales Mindset',
        level: 'Developing',
        description: 'Identifying business opportunities, understanding customer needs, and presenting solutions clearly and persuasively.',
      },
      {
        name: 'Problem Solving',
        level: 'Advanced',
        description: 'Breaking down complex, unfamiliar problems and using AI tools to research, analyse, and deliver practical solutions.',
      },
    ],
  },
] as const;

const navItems = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Journey', 'journey'],
  ['Skills', 'skills'],
  ['Projects', 'projects'],
  ['Contact', 'contact'],
] as const;

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: 'smooth' });
}

function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );

    const timer = window.setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    }, 30);

    const sections = navItems
      .map(([, id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      window.clearTimeout(timer);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <div className="noise min-h-[100dvh] overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-violet-200/70 bg-[#fbf9ff]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              go('home');
            }}
            className="focus-ring flex items-center gap-2"
            data-testid="link-home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#6f3cc4] font-display text-sm font-bold text-white shadow-[0_8px_20px_-8px_#6f3cc4]">
              KB
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[#33264e]">
              Kritika<span className="text-[#8050ce]">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(id);
                }}
                className={`focus-ring text-[13px] font-semibold transition-colors ${
                  active === id ? 'text-[#6f3cc4]' : 'text-[#665b77] hover:text-[#6f3cc4]'
                }`}
                data-testid={`link-nav-${label.toLowerCase()}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              go('contact');
            }}
            className="focus-ring hidden rounded-full bg-[#33264e] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#6f3cc4] sm:inline-flex"
            data-testid="link-header-contact"
          >
            Let&apos;s connect <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="focus-ring rounded-lg p-2 text-[#33264e] md:hidden"
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-violet-100 bg-[#fbf9ff] px-5 py-4 md:hidden" aria-label="Mobile navigation">
            {navItems.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  go(id);
                }}
                className={`block border-b border-violet-100 py-3 text-sm font-semibold ${
                  active === id ? 'text-[#6f3cc4]' : 'text-[#665b77]'
                }`}
                data-testid={`link-mobile-${label.toLowerCase()}`}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="pt-[72px]">{children}</main>

      <footer className="border-t border-violet-100 bg-[#fbf9ff] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#806f99] sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              go('home');
            }}
            className="font-display font-semibold text-[#45315e]"
            data-testid="link-footer-home"
          >
            Kritika<span className="text-[#8050ce]">.</span>
          </a>
          <span>Digital marketing. AI-assisted development. Content that performs.</span>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              go('contact');
            }}
            className="focus-ring inline-flex items-center gap-2 font-semibold text-[#6f3cc4]"
            data-testid="link-footer-contact"
          >
            Let&apos;s connect <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="reveal">
        <p className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[.22em] text-[#8050ce]">
          <span className="h-px w-9 bg-[#8050ce]" /> {eyebrow}
        </p>
        <h2 className="max-w-5xl font-display text-[clamp(2.9rem,8.5vw,7.2rem)] font-semibold leading-[.94] tracking-[-.07em] text-[#33264e]">
          {title}
          <br />
          <span className="text-[#6f3cc4]">{accent}</span>
        </h2>
      </div>
      <p className="reveal reveal-delay-1 mt-8 max-w-2xl text-lg leading-8 text-[#746783]">{description}</p>
    </div>
  );
}

function HeroPhoto() {
  return (
    <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[460px]">
      <div className="absolute -left-5 top-10 h-20 w-20 rounded-3xl border border-violet-200 bg-white/60 backdrop-blur-sm" />
      <div className="absolute -right-5 bottom-12 h-28 w-28 rounded-full border border-[#e9d68d] bg-[#fff8df]/80" />
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border-8 border-white bg-[#eee7fa] shadow-[0_28px_60px_-26px_rgba(74,43,123,.42)]">
        <img
          src="/kritika.jpg"
          alt="Kritika Bhagoria, Digital Marketing &amp; AI Creator from Pundri, Haryana"
          width={1086}
          height={1448}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute -bottom-5 left-8 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-[0_10px_30px_-18px_#5d3c8a]">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a8da9]">Currently</p>
        <p className="mt-1 text-sm font-bold text-[#45315e]">Building with AI</p>
      </div>
    </div>
  );
}

const hobbies = [
  {
    id: 'exploring',
    testId: 'hobby-exploring',
    icon: BookOpen,
    title: 'Exploring new topics',
    body: 'I enjoy exploring new topics and gathering information on subjects that catch my interest, then turning what I learn into something useful.',
    tone: 'bg-[#f6f1ff]',
    iconTone: 'text-[#6f3cc4] bg-white',
    titleTone: 'text-[#45315e]',
    bodyTone: 'text-[#746783]',
  },
  {
    id: 'dance',
    testId: 'hobby-dance',
    icon: Music,
    title: 'Dance',
    body: 'Dance is my way of staying expressive and balanced. It keeps me connected to rhythm, movement, and creative energy.',
    tone: 'bg-[#fff8df]',
    iconTone: 'text-[#a9822f] bg-white',
    titleTone: 'text-[#45315e]',
    bodyTone: 'text-[#746783]',
  },
  {
    id: 'arts-crafts',
    testId: 'hobby-arts-crafts',
    icon: Palette,
    title: 'Arts and crafts',
    body: 'I like arts and crafts because they let me work with my hands. Creating something by hand is a genuinely relaxing break from screens.',
    tone: 'bg-[#fdf1f7]',
    iconTone: 'text-[#a8447f] bg-white',
    titleTone: 'text-[#45315e]',
    bodyTone: 'text-[#746783]',
  },
  {
    id: 'travel',
    testId: 'hobby-travel',
    icon: Plane,
    title: 'Travel',
    body: 'Travel exposes me to new places, people, and perspectives. It keeps my curiosity active and reminds me how much there is still to learn.',
    tone: 'bg-[#eef6ff]',
    iconTone: 'text-[#2f6fb5] bg-white',
    titleTone: 'text-[#45315e]',
    bodyTone: 'text-[#746783]',
  },
];

const HERO_LINE_ONE = 'I am';
const HERO_LINE_TWO = 'Kritika';

const PROFILE_PHOTO = '/kritika.jpg';

function AboutPhoto() {
  return (
    <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[420px]">
      <div className="absolute -left-6 top-14 h-24 w-24 rounded-[2rem] border border-violet-200 bg-white/60 backdrop-blur-sm" />
      <div className="absolute -right-6 bottom-16 h-32 w-32 rounded-full border border-[#e9d68d] bg-[#fff8df]/80" />
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border-8 border-white bg-[#eee7fa] shadow-[0_28px_60px_-26px_rgba(74,43,123,.42)]">
        {PROFILE_PHOTO ? (
          <img
            src={PROFILE_PHOTO}
            alt="Kritika Bhagoria, Digital Marketing &amp; AI Creator from Pundri, Haryana"
            width={1086}
            height={1448}
            className="relative h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_22%,#d6c4f4,transparent_36%),linear-gradient(160deg,#f5f0ff,#e3d8f8)]" />
            <div className="absolute left-[13%] top-[24%] h-3 w-3 rounded-full bg-[#8050ce]" />
            <div className="absolute right-[15%] top-[17%] h-2.5 w-2.5 rounded-full bg-[#dfb83e]" />
            <div className="absolute bottom-[9%] right-[11%] h-36 w-36 rounded-full border border-[#c7b2ee]" />
            <div className="relative flex h-full flex-col items-center justify-center px-9 text-center">
              <div className="float-slow mb-7 grid h-32 w-32 place-items-center rounded-full border-2 border-dashed border-[#9a73da] bg-white/45">
                <span className="font-display text-4xl font-semibold text-[#6f3cc4]">KB</span>
              </div>
              <p className="font-display text-2xl font-semibold tracking-tight text-[#45315e]">Your Photo Here</p>
              <p className="mt-3 max-w-[250px] text-sm leading-6 text-[#806f99]">
                Save your photo as <span className="font-semibold text-[#6f3cc4]">public/kritika.jpg</span>, then set{' '}
                <span className="font-semibold text-[#6f3cc4]">PROFILE_PHOTO</span> in App.tsx.
              </p>
            </div>
          </>
        )}
      </div>
      <div className="absolute -bottom-5 left-6 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-[0_10px_30px_-18px_#5d3c8a]">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a8da9]">Currently</p>
        <p className="mt-1 text-sm font-bold text-[#45315e]">Building with AI</p>
      </div>
    </div>
  );
}

function TypedHero() {
  const [lineOne, setLineOne] = useState('');
  const [lineTwo, setLineTwo] = useState('');

  useEffect(() => {
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        const id = window.setInterval(() => {
          setLineOne((current) => {
            const next = current.length + 1;
            if (next >= HERO_LINE_ONE.length) {
              window.clearInterval(id);
              return HERO_LINE_ONE;
            }
            return HERO_LINE_ONE.slice(0, next);
          });
        }, 90);
      }, 450),
    );

    timers.push(
      window.setTimeout(() => {
        const id = window.setInterval(() => {
          setLineTwo((current) => {
            const next = current.length + 1;
            if (next >= HERO_LINE_TWO.length) {
              window.clearInterval(id);
              return HERO_LINE_TWO;
            }
            return HERO_LINE_TWO.slice(0, next);
          });
        }, 90);
      }, 450 + HERO_LINE_ONE.length * 90 + 260),
    );

    return () => {
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    };
  }, []);

  return (
    <>
      <span>
        {lineOne}
        {!lineOne && <span className="typing-cursor" aria-hidden="true" />}
        {lineOne && !lineTwo && <span className="typing-cursor" aria-hidden="true" />}
      </span>
      <span className="text-[#8050ce]">
        {lineTwo}
        {lineTwo.length < HERO_LINE_TWO.length && <span className="typing-cursor" aria-hidden="true" />}
      </span>
    </>
  );
}

function Hero() {
  return (
    <section className="site-grid relative isolate px-5 pb-24 pt-24 sm:px-8 lg:px-12 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute -right-32 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-violet-300/25 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <div className="reveal mb-7 flex items-center gap-4 text-[clamp(.95rem,1.9vw,1.4rem)] font-bold uppercase tracking-[.2em] text-[#8050ce]">
            <span className="h-px w-12 bg-[#8050ce]" /> Welcome to my world
          </div>
          <div className="reveal reveal-delay-1">
            <h1 className="hero-name-loop max-w-5xl font-display text-[clamp(2.6rem,7.5vw,6.4rem)] font-semibold leading-[.98] tracking-[-.07em] text-[#33264e]">
              <TypedHero />
            </h1>
            <p className="reveal reveal-delay-2 mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[clamp(1.35rem,3.2vw,2.6rem)] font-semibold leading-tight tracking-[-.03em] text-[#5d4b7b] sm:mt-7">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#e5c95e]" />
              <span>Digital Marketer</span>
              <span className="text-[#a99abd]">&amp;</span>
              <span className="text-[#8050ce]">AI Creator</span>
            </p>
          </div>
          <p className="reveal reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-[#665b77]">
            I combine digital marketing strategy with AI-assisted development and content production to build digital experiences that are clear, practical, and measurable.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('projects');
              }}
              className="focus-ring inline-flex items-center rounded-full bg-[#6f3cc4] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_26px_-14px_#6f3cc4] transition-all hover:-translate-y-1 hover:bg-[#57309f]"
              data-testid="link-hero-project"
            >
              View my work <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('about');
              }}
              className="focus-ring inline-flex items-center rounded-full px-5 py-3.5 text-sm font-bold text-[#5d4b7b] transition-colors hover:bg-violet-100/70"
              data-testid="link-hero-about"
            >
              About me <ArrowDown className="ml-2 h-4 w-4" />
            </a>
          </div>
          <div className="reveal reveal-delay-3 mt-14 flex items-center gap-7 border-t border-violet-200/80 pt-5 text-sm text-[#776b87]">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8050ce]" /> Pundri, Haryana</span>
            <span className="hidden h-4 w-px bg-violet-200 sm:block" />
            <span className="hidden sm:inline">Available for freelance &amp; collaborative projects</span>
          </div>
        </div>
<HeroPhoto />
        </div>
      </section>
    );
}

function About() {
  return (
    <section className="site-grid px-5 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-32">
      <SectionIntro
        eyebrow="About me"
        title="Curiosity with"
        accent="a clear direction."
        description="An overview of my background, current focus, and the principles that guide how I work."
      />

<div className="mx-auto mt-16 max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <AboutPhoto />
          <div className="reveal reveal-delay-1">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">A note from Kritika</p>
            <div className="mt-6 h-2 w-24 rounded-full bg-[#e5c95e]" />
            <h3 className="mt-8 text-balance font-display text-[2rem] font-semibold leading-[1.12] tracking-[-.045em] text-[#33264e] sm:text-5xl lg:text-[3.4rem]">
              I am Kritika Bhagoria, a{' '}
              <span className="text-[#8050ce]">digital marketing</span> and{' '}
              <span className="text-[#8050ce]">AI practitioner</span> based in Pundri, Haryana.
            </h3>
            <p className="mt-8 text-lg leading-9 text-[#5f5173] sm:text-xl sm:leading-10">
              I apply modern AI tooling to turn ideas into practical, results-oriented digital experiences.
            </p>
            <p className="mt-5 text-base leading-8 text-[#746783]">
              Growing up in a small town taught me to be resourceful, self-directed, and consistent in my
              learning. I have delivered websites, web games, and digital content using AI-assisted workflows,
              while actively building expertise in communication, business, and digital entrepreneurship.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f6f1ff] p-5">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9577bc]">Education</p>
                <p className="mt-2 font-display text-lg font-semibold text-[#45315e]">B.A. — Digital Marketing &amp; AI</p>
                <p className="mt-1 text-sm text-[#806f99]">Undergraduate, Year 1</p>
              </div>
              <div className="rounded-2xl bg-[#fff8df] p-5">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a18b43]">Based in</p>
                <p className="mt-2 font-display text-lg font-semibold text-[#45315e]">Pundri, Haryana</p>
                <p className="mt-1 text-sm text-[#806f99]">India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl">
        <div className="rounded-[2rem] bg-white px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <div className="reveal">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">What drives my work</p>
              <h3 className="mt-5 font-display text-4xl font-semibold tracking-[-.06em] text-[#33264e] sm:text-6xl">
                Keep learning.
                <br />
                <span className="text-[#8050ce]">Keep creating.</span>
              </h3>
            </div>
            <div className="reveal reveal-delay-1">
              <p className="text-lg leading-9 text-[#5f5173] sm:text-xl sm:leading-10">
                My work is guided by curiosity, clear communication, and practical execution.
              </p>
              <p className="mt-5 text-base leading-8 text-[#746783]">
                Every project is an opportunity to turn a well-defined idea into something genuinely useful.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl">
        <div className="reveal mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">Beyond work</p>
            <h3 className="mt-4 font-display text-4xl font-semibold tracking-[-.06em] text-[#33264e] sm:text-5xl">
              My hobbies
            </h3>
          </div>
          <p className="max-w-md text-base leading-7 text-[#746783]">
            Away from the screen, these are the things that keep me curious, grounded, and creative.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hobbies.map((hobby, i) => {
            const Icon = hobby.icon;

            return (
              <div
                key={hobby.id}
                data-testid={hobby.testId}
                className={`reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : i === 3 ? 'reveal-delay-3' : ''} rounded-3xl p-6 ${hobby.tone}`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${hobby.iconTone} shadow-[0_8px_20px_-14px_#5f378e]`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className={`mt-6 font-display text-xl font-semibold ${hobby.titleTone}`}>
                  {hobby.title}
                </h4>
                <p className={`mt-3 text-sm leading-7 ${hobby.bodyTone}`}>{hobby.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps: [string, string, string][] = [
['01', 'Class 10 — 2024', 'I completed my Class 10 examinations in 2024 with 65%. It was during these school years that I started noticing how much I enjoyed working with technology and creating things.'],
    ['02', 'Class 12 — 2026', 'I completed my Class 12 examinations in 2026 with 70%, and decided to continue my studies in the digital direction.'],
    ['03', 'B.A. — First Year', 'I am currently in the first year of my Bachelor of Arts degree, continuing my higher studies after Class 12.'],
    ['04', 'Digital Marketing with AI', 'I am studying Digital Marketing with AI to build my skills in this field. I use AI-assisted workflows to learn faster, build websites and web games, and improve my digital marketing and communication abilities.'],
    ['05', 'Building toward a bigger picture', 'The next phase is focused on business development, sales, client communication, and long-term digital entrepreneurship.'],
  ];

  return (
    <section className="bg-[#33264e] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal">
          <p className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[.22em] text-[#e5c95e]">
            <span className="h-px w-9 bg-[#e5c95e]" /> My journey
          </p>
          <h2 className="max-w-5xl font-display text-[clamp(2.9rem,8.5vw,7.2rem)] font-semibold leading-[.94] tracking-[-.07em]">
            Starting with
            <br />
            <span className="text-[#f5d96e]">curiosity.</span>
          </h2>
        </div>
        <p className="reveal reveal-delay-1 mt-8 max-w-2xl text-lg leading-8 text-[#bcb0ce]">
          From Pundri, Haryana into the digital industry — a path defined by continuous learning, hands-on building, and purposeful growth.
        </p>

        <div className="reveal reveal-delay-1 mt-16 max-w-3xl">
          <p className="text-2xl leading-[1.5] text-[#ede7f8] sm:text-3xl">I started without a coding background and used AI tools to build practical, deployable digital projects.</p>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#bcb0ce]">My current focus is strengthening my capabilities in business, sales, communication, and digital entrepreneurship. Each project adds a measurable lesson and moves the work forward.</p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, copy], index) => (
            <div key={number} className={`reveal reveal-delay-${index + 1} rounded-3xl border border-white/15 bg-white/5 p-7`}>
              <span className="font-display text-5xl font-semibold text-[#e5c95e]">{number}</span>
              <h3 className="mt-12 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#bcb0ce]">{copy}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 flex items-center gap-4 border-t border-white/15 pt-7 text-sm text-[#e9dcf8]">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e5c95e] text-[#33264e]"><Sparkles className="h-5 w-5" /></span>
          <span className="font-semibold">The journey so far — and the work still ahead.</span>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="site-grid px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <SectionIntro
        eyebrow="My skills"
        title="An evolving"
        accent="professional toolkit."
        description="Technology evolves quickly. Consistent learning, deliberate experimentation, and reliable execution are what create lasting professional value."
      />

      <div className="mx-auto mt-16 max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-3xl border border-violet-100 bg-white px-6 py-5 sm:px-8">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <a
                key={group.id}
                href={`#skill-${group.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  const el = document.getElementById(`skill-${group.id}`);
                  if (!el) return;
                  window.scrollTo({
                    top: el.getBoundingClientRect().top + window.scrollY - 92,
                    behavior: 'smooth',
                  });
                }}
                className="focus-ring inline-flex items-center gap-2.5 text-sm font-bold text-[#45315e] transition-colors hover:text-[#6f3cc4]"
                data-testid={`link-skill-group-${group.id}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: `${group.accent}18` }}>
                  <Icon className="h-[18px] w-[18px]" style={{ color: group.accent }} />
                </span>
                {group.title}
              </a>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                id={`skill-${group.id}`}
                data-testid={`skill-group-${group.id}`}
                className="reveal flex flex-col overflow-hidden rounded-2xl border-2 bg-white"
                style={{ borderColor: group.accentBorder }}
              >
                <span className="h-1.5 w-full" style={{ backgroundColor: group.accent }} />

                <div className="flex items-center gap-3 px-6 py-5">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${group.accent}1f` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: group.accent }} />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-[#33264e]">{group.title}</h3>
                    <p className="text-xs font-bold uppercase tracking-[.14em]" style={{ color: group.accent }}>
                      {group.items.length} skills
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-6 pb-6">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl border border-l-4 border-violet-100 bg-[#faf8ff] px-4 py-4 transition-colors hover:border-[#cbb8ee] sm:px-5"
                      style={{ borderLeftColor: group.accent }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="text-base font-bold text-[#45315e]">{item.name}</h4>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em]"
                          style={{ backgroundColor: `${group.accent}14`, color: group.accent }}
                        >
                          {item.level}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[#746783]">{item.description}</p>
                      {'proof' in item && item.proof ? (
                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-white px-3 py-1 text-[11px] font-bold text-[#6f3cc4]">
                          <Check className="h-3 w-3" /> Proof: {item.proof}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-14 rounded-[2rem] border border-violet-100 bg-white p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8050ce]">Learning mindset</p>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h3 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-[#45315e] sm:text-4xl">I am continuously learning, testing, and refining the way I create.</h3>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection('contact');
              }}
              className="focus-ring inline-flex w-fit items-center rounded-full bg-[#6f3cc4] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#57309f]"
              data-testid="link-skills-contact"
            >
              Start a conversation <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-white p-8 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#fff8df]/60 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">My Vision</p>
            <h2 className="mt-4 text-balance font-display text-4xl font-semibold tracking-[-.06em] text-[#33264e] sm:text-5xl lg:text-[2.95rem]">
              Driven digital business that helps small businesses grow online —
              <br className="hidden lg:block" />
              <span className="text-[#8050ce]"> and become a trusted name in the digital industry</span>
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-[#5f5173]">
              I want to build a purpose-driven digital business focused on helping small businesses grow online and become a trusted name in the digital industry. My goal is to turn simple ideas into practical tools that bring real growth for the businesses I work with.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    href: 'https://pizza-ride01-main.vercel.app/',
    testId: 'link-project-pizza-ride',
    tag: 'Website / E-commerce',
    title: 'Pizza Ride — Ordering Website',
    wordOne: 'Pizza',
    wordTwo: 'Ride',
    tagline: 'Simple ordering. Warm delivery. A frictionless checkout.',
    body: 'A streamlined online ordering experience with menu browsing and a WhatsApp-based checkout flow that reduces friction at the point of purchase.',
    cta: 'View live website',
    cover: 'bg-[#5d2f96]',
    blobA: 'border-[#e6c65b]/90',
    blobB: 'border-[#8b5ad0]/70',
    accent: 'text-[#f5d96e]',
  },
  {
    href: 'https://game-nine-phi-78.vercel.app/',
    testId: 'link-project-mind-test',
    tag: 'Game / AI-assisted',
    title: 'Mind Test — Browser Quiz Game',
    wordOne: 'Mind',
    wordTwo: 'Test',
    tagline: 'Timed rounds. Rising difficulty. A genuine test of focus.',
    body: 'A browser-based quiz game that challenges recall, focus, and speed through timed rounds with increasing difficulty — developed with AI-assisted workflows.',
    cta: 'Play the game',
    cover: 'bg-[#1f6f6b]',
    blobA: 'border-[#7fe0d6]/80',
    blobB: 'border-[#2fa39b]/70',
    accent: 'text-[#9df0e4]',
  },
] as const;

function Projects() {
  return (
    <section className="bg-[#f1ebff] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <SectionIntro
        eyebrow="My projects"
        title="Built for"
        accent="real-world use."
        description="Selected work delivered through AI-assisted workflows, with a consistent focus on clarity, usability, and measurable outcomes."
      />

      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-6">
        {projects.map((project) => (
          <a
            key={project.testId}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="focus-ring reveal group block overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-[0_24px_60px_-40px_#5d3c8a] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_-38px_#5d3c8a]"
            data-testid={project.testId}
          >
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className={`relative min-h-[330px] overflow-hidden p-8 sm:p-12 ${project.cover}`}>
                <div className={`absolute -right-14 -top-14 h-64 w-64 rounded-full border-[22px] ${project.blobA}`} />
                <div className={`absolute -bottom-28 -left-12 h-72 w-72 rounded-full border-[30px] ${project.blobB}`} />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between text-white/70"><span className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold uppercase tracking-[.18em]">Live project</span><ExternalLink className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                  <div><p className={`font-display text-5xl font-semibold tracking-[-.06em] text-white sm:text-7xl`}>{project.wordOne}<br /><span className={project.accent}>{project.wordTwo}</span></p><p className="mt-4 text-sm font-medium text-white/65">{project.tagline}</p></div>
                </div>
              </div>
              <div className="flex flex-col justify-between p-8 sm:p-12">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#a08ab8]">{project.tag}</p><h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#45315e]">{project.title}</h3><p className="mt-5 max-w-md text-base leading-7 text-[#746783]">{project.body}</p></div>
                <div className="mt-12 flex items-center justify-between border-t border-violet-100 pt-5 text-sm font-bold text-[#6f3cc4]"><span>{project.cta}</span><ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const message = String(data.get('message') || '');
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:kritikabhagoria151@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Contact"
          title="Let’s build"
          accent="something meaningful."
          description="Have a project idea, a collaboration in mind, or a question? I welcome the opportunity to discuss it."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">Get in touch</p>            <a href="mailto:kritikabhagoria151@gmail.com" className="focus-ring mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#5e389d] underline decoration-violet-200 underline-offset-8 transition-colors hover:text-[#33264e]" data-testid="link-email"><Mail className="h-4 w-4" /> kritikabhagoria151@gmail.com</a>
            <div className="mt-12 rounded-3xl bg-[#f6f1ff] p-7">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9577bc]">Based in</p>
              <p className="mt-3 inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#45315e]"><MapPin className="h-5 w-5 text-[#8050ce]" /> Pundri, Haryana</p>
              <p className="mt-3 text-sm text-[#806f99]">Open to remote freelance and project-based work.</p>
            </div>
          </div>
          <form onSubmit={handleContact} className="reveal reveal-delay-1 rounded-[2rem] border border-violet-100 bg-[#faf8ff] p-6 sm:p-9" data-testid="form-contact">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[#45315e]">Name<input required name="name" type="text" placeholder="Your full name" className="focus-ring mt-2 w-full rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-name" /></label>
              <label className="text-sm font-semibold text-[#45315e]">Email address<input required name="email" type="email" placeholder="you@example.com" className="focus-ring mt-2 w-full rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-email" /></label>
            </div>
            <label className="mt-6 block text-sm font-semibold text-[#45315e]">Project details<textarea required name="message" rows={6} placeholder="Briefly describe your project, goals, and timeline..." className="focus-ring mt-2 w-full resize-none rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-message" /></label>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button type="submit" className="focus-ring inline-flex items-center rounded-full bg-[#6f3cc4] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#57309f]" data-testid="button-send-message">{sent ? <><Check className="mr-2 h-4 w-4" /> Draft prepared</> : <>Open email draft <ArrowUpRight className="ml-2 h-4 w-4" /></>}</button><span className="text-xs text-[#9a8da9]">Your email app will open</span></div>
          </form>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Shell>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="journey">
          <Journey />
        </section>
        <section id="skills">
          <Skills />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <Vision />
        <section id="contact">
          <Contact />
        </section>
      </Shell>
    </ErrorBoundary>
  );
}

export default App;
