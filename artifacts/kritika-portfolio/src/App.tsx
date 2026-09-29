import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const skills = [
  { name: 'AI Tools & Prompting', level: 'Expert', size: 'large' },
  { name: 'Website Development using AI', level: 'Building', size: 'wide' },
  { name: 'Game Development using AI', level: 'Building', size: 'small' },
  { name: 'Video Creation using AI', level: 'Creating', size: 'small' },
  { name: 'Digital Marketing', level: 'Growing', size: 'small' },
  { name: 'Social Media Marketing', level: 'Growing', size: 'small' },
  { name: 'Content Creation', level: 'Creating', size: 'wide' },
];

const navItems = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Journey', '#journey'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
] as const;

function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    const timer = window.setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }, 30);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [location]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="noise min-h-[100dvh] overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-violet-200/70 bg-[#fbf9ff]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#home" onClick={closeMenu} className="focus-ring flex items-center gap-2" data-testid="link-home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#6f3cc4] font-display text-sm font-bold text-white shadow-[0_8px_20px_-8px_#6f3cc4]">
              KB
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-[#33264e]">
              Kritika<span className="text-[#8050ce]">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`focus-ring text-[13px] font-semibold transition-colors ${
                  'text-[#665b77] hover:text-[#6f3cc4]'
                }`}
                data-testid={`link-nav-${label.toLowerCase()}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
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
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="block border-b border-violet-100 py-3 text-sm font-semibold text-[#665b77] hover:text-[#6f3cc4]"
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
          <a href="#home" className="font-display font-semibold text-[#45315e]" data-testid="link-footer-home">
            Kritika<span className="text-[#8050ce]">.</span>
          </a>
           <span>Digital marketing. AI creation. Digital experiences.</span>
          <a href="#contact" className="focus-ring inline-flex items-center gap-2 font-semibold text-[#6f3cc4]" data-testid="link-footer-contact">
            Let&apos;s connect <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function PageIntro({
  number,
  eyebrow,
  title,
  accent,
  description,
}: {
  number: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
}) {
  return (
    <section className="site-grid px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="reveal flex items-end justify-between gap-8">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">
              <span className="h-px w-9 bg-[#8050ce]" /> {number} / {eyebrow}
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[.98] tracking-[-.07em] text-[#33264e] sm:text-7xl lg:text-8xl">
              {title}
              <br />
              <span className="text-[#8050ce]">{accent}</span>
            </h1>
          </div>
          <span className="hidden font-display text-7xl font-semibold text-violet-200 sm:block">{number}</span>
        </div>
        <p className="reveal reveal-delay-1 mt-8 max-w-2xl text-lg leading-8 text-[#746783]">{description}</p>
      </div>
    </section>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[460px]">
      <div className="absolute -left-5 top-10 h-20 w-20 rounded-3xl border border-violet-200 bg-white/60 backdrop-blur-sm" />
      <div className="absolute -right-5 bottom-12 h-28 w-28 rounded-full border border-[#e9d68d] bg-[#fff8df]/80" />
      <div className="relative aspect-square overflow-hidden rounded-full border-8 border-white bg-[#eee7fa] shadow-[0_28px_60px_-26px_rgba(74,43,123,.42)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_30%,#d6c4f4,transparent_34%),linear-gradient(145deg,#f5f0ff,#e3d8f8)]" />
        <div className="absolute left-[14%] top-[13%] h-3 w-3 rounded-full bg-[#8050ce]" />
        <div className="absolute right-[15%] top-[20%] h-2 w-2 rounded-full bg-[#dfb83e]" />
        <div className="absolute bottom-[13%] left-[12%] h-20 w-20 rounded-full border border-[#c7b2ee]" />
        <div className="absolute bottom-[16%] right-[11%] h-32 w-32 rounded-full border border-[#c7b2ee]" />
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="float-slow mb-7 grid h-32 w-32 place-items-center rounded-full border-2 border-dashed border-[#9a73da] bg-white/45">
            <span className="font-display text-4xl font-semibold text-[#6f3cc4]">KB</span>
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight text-[#45315e]">Add Your Photo Here</p>
          <p className="mt-3 max-w-[220px] text-sm leading-6 text-[#806f99]">
            A portrait will make this space yours. Replace this placeholder whenever you&apos;re ready.
          </p>
        </div>
      </div>
      <div className="absolute -bottom-5 left-8 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-[0_10px_30px_-18px_#5d3c8a]">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#9a8da9]">Currently</p>
        <p className="mt-1 text-sm font-bold text-[#45315e]">Building with AI</p>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <section id="home" className="site-grid relative isolate scroll-mt-24 px-5 pb-24 pt-24 sm:px-8 lg:px-12 lg:pb-32 lg:pt-40">
        <div className="pointer-events-none absolute -right-32 top-24 -z-10 h-[420px] w-[420px] rounded-full bg-violet-300/25 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="reveal mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">
              <span className="h-px w-9 bg-[#8050ce]" /> Digital marketer &amp; AI creator
            </div>
            <div className="reveal reveal-delay-1">
              <h1 className="hero-name-loop max-w-4xl font-display text-[clamp(3.5rem,9vw,7.4rem)] font-semibold leading-[.92] tracking-[-.075em] text-[#33264e]">
                I am
                <br />
                <span className="text-[#8050ce]">Kritika.</span>
              </h1>
            </div>
            <p className="reveal reveal-delay-2 mt-8 max-w-xl text-lg leading-8 text-[#665b77]">
              I combine digital marketing, AI-powered creativity, and practical building to turn ideas into meaningful digital experiences.
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <a href="#projects" className="focus-ring inline-flex items-center rounded-full bg-[#6f3cc4] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_26px_-14px_#6f3cc4] transition-all hover:-translate-y-1 hover:bg-[#57309f]" data-testid="link-hero-project">
                View my work <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#about" className="focus-ring inline-flex items-center rounded-full px-5 py-3.5 text-sm font-bold text-[#5d4b7b] transition-colors hover:bg-violet-100/70" data-testid="link-hero-about">
                About me <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </div>
            <div className="reveal reveal-delay-3 mt-14 flex items-center gap-7 border-t border-violet-200/80 pt-5 text-sm text-[#776b87]">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8050ce]" /> Pundri, Haryana</span>
              <span className="hidden h-4 w-px bg-violet-200 sm:block" />
               <span className="hidden sm:inline">Continuously learning</span>
            </div>
          </div>
          <PhotoPlaceholder />
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-10 flex flex-col gap-5 border-b border-violet-100 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">Portfolio overview</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-[-.06em] text-[#33264e] sm:text-5xl">
                What I do and what you can explore.
              </h2>
            </div>
            <p className="max-w-md text-base leading-7 text-[#746783]">
              A quick guide to my skills, story, and selected work—all in one place.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
           <a href="#about" className="reveal group rounded-3xl bg-[#f6f1ff] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-28px_#5f378e]" data-testid="card-home-about">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9577bc]">01 / About</p>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#45315e]">Curiosity with a clear direction.</h2>
            <p className="mt-4 text-sm leading-7 text-[#806f99]">Learn about my background, perspective, and the ideas that shape my work.</p>
            <span className="mt-7 inline-flex items-center text-sm font-bold text-[#6f3cc4]">Explore my story <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
           </a>
           <a href="#skills" className="reveal reveal-delay-1 group rounded-3xl bg-[#fff8df] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-28px_#ae8c33]" data-testid="card-home-skills">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a18b43]">02 / Skills</p>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#45315e]">A toolkit that keeps evolving.</h2>
            <p className="mt-4 text-sm leading-7 text-[#806f99]">Explore the skills I am developing across AI, content, and digital marketing.</p>
            <span className="mt-7 inline-flex items-center text-sm font-bold text-[#6f3cc4]">View my capabilities <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
           </a>
           <a href="#projects" className="reveal reveal-delay-2 group rounded-3xl bg-[#33264e] p-7 text-white transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-28px_#33264e]" data-testid="card-home-projects">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e5c95e]">03 / Work</p>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">Built for real-world use.</h2>
            <p className="mt-4 text-sm leading-7 text-[#c9bdd9]">Explore a project created with AI-assisted workflows and a focus on simple user experiences.</p>
            <span className="mt-7 inline-flex items-center text-sm font-bold text-[#f5d96e]">View project <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
           </a>
          </div>
        </div>
      </section>
      <div id="about" className="scroll-mt-24"><About /></div>
      <div id="journey" className="scroll-mt-24"><Journey /></div>
      <div id="skills" className="scroll-mt-24"><Skills /></div>
      <div id="projects" className="scroll-mt-24"><Projects /></div>
      <div id="contact" className="scroll-mt-24"><Contact /></div>
    </>
  );
}

function About() {
  return (
    <>
      <PageIntro number="01" eyebrow="About me" title="Curiosity with" accent="a clear direction." description="Learn more about my background, what I am building, and the principles that guide my growth." />
      <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-24">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">A note from Kritika</p>
            <div className="mt-8 h-2 w-24 rounded-full bg-[#e5c95e]" />
          </div>
          <div className="reveal reveal-delay-1">
            <p className="text-balance text-2xl font-medium leading-[1.45] tracking-tight text-[#45315e] sm:text-3xl">
              I am Kritika Bhagoria, a digital marketing and AI enthusiast from Pundri, Haryana. I use emerging tools to turn ideas into practical digital experiences.
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#746783]">
              Coming from a small town has taught me to stay resourceful, curious, and committed to learning. I have built websites, games, and digital content with AI tools, while continuing to explore communication, business, and entrepreneurship.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f6f1ff] p-5">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9577bc]">Education</p>
                <p className="mt-2 font-display text-lg font-semibold text-[#45315e]">Digital Marketing with AI</p>
                <p className="mt-1 text-sm text-[#806f99]">BA 1st Year</p>
              </div>
              <div className="rounded-2xl bg-[#fff8df] p-5">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a18b43]">Based in</p>
                <p className="mt-2 font-display text-lg font-semibold text-[#45315e]">Pundri, Haryana</p>
                <p className="mt-1 text-sm text-[#806f99]">India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="site-grid px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <PhotoPlaceholder />
          <div className="reveal">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">What drives my work</p>
            <h2 className="font-display text-4xl font-semibold tracking-[-.06em] text-[#33264e] sm:text-6xl">Keep learning.<br /><span className="text-[#8050ce]">Keep creating.</span></h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#746783]">I value curiosity, clear communication, and practical execution. Every project is an opportunity to turn a thoughtful idea into something useful.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Journey() {
  return (
    <>
      <PageIntro number="02" eyebrow="The journey" title="Starting with" accent="curiosity." description="From Pundri, Haryana to the digital world — my journey is focused on learning, building, and growing with purpose." />
      <section className="bg-[#33264e] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="reveal max-w-3xl">
            <p className="text-2xl leading-[1.5] text-[#ede7f8] sm:text-3xl">I began with no coding background and used AI tools to build practical digital projects.</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#bcb0ce]">My focus is to develop stronger skills in business, sales, communication, and digital entrepreneurship. Each experiment adds a new lesson and moves the work forward.</p>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Exploring the possibilities', 'Curiosity became the first step. I began exploring how digital tools could help me create and communicate more effectively.'],
              ['02', 'Turning ideas into projects', 'AI tools helped me move from concepts to websites, games, and digital content without a traditional coding background.'],
              ['03', 'Growing with purpose', 'The next chapter is focused on business, sales, communication, and digital entrepreneurship.'],
            ].map(([number, title, copy], index) => (
              <div key={number} className={`reveal reveal-delay-${index + 1} rounded-3xl border border-white/15 bg-white/5 p-7`}>
                <span className="font-display text-5xl font-semibold text-[#e5c95e]">{number}</span>
                <h2 className="mt-12 font-display text-2xl font-semibold">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#bcb0ce]">{copy}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-16 flex items-center gap-4 border-t border-white/15 pt-7 text-sm text-[#e9dcf8]">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e5c95e] text-[#33264e]"><Sparkles className="h-5 w-5" /></span>
             <span className="font-semibold">The journey is underway.</span>
          </div>
        </div>
      </section>
    </>
  );
}

function Skills() {
  return (
    <>
      <PageIntro number="03" eyebrow="My skills" title="An evolving" accent="professional toolkit." description="Technology changes quickly. Consistent learning, thoughtful experimentation, and reliable execution create lasting value." />
      <section className="site-grid px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, index) => (
              <div key={skill.name} className={`reveal reveal-delay-${(index % 3) + 1} group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#bba0e9] hover:shadow-[0_18px_30px_-22px_#5f378e] ${skill.size === 'large' ? 'lg:col-span-2 bg-[#f2e9ff]' : skill.size === 'wide' ? 'lg:col-span-2' : ''}`}>
                <span className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-violet-100/60 transition-transform duration-500 group-hover:scale-150" />
                <span className="relative text-xs font-bold uppercase tracking-[.16em] text-[#a08ab8]">0{index + 1}</span>
                <div className="relative">
                  <h2 className="max-w-[260px] font-display text-xl font-semibold leading-tight text-[#45315e]">{skill.name}</h2>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#8050ce]"><span className="h-1.5 w-1.5 rounded-full bg-[#8050ce]" />{skill.level}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-14 rounded-[2rem] border border-violet-100 bg-white p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8050ce]">Learning mindset</p>
            <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
               <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-[#45315e] sm:text-4xl">I am continually learning, experimenting, and refining how I create.</h2>
               <Link href="/contact" className="focus-ring inline-flex w-fit items-center rounded-full bg-[#6f3cc4] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#57309f]" data-testid="link-skills-contact">Start a conversation <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Projects() {
  return (
    <>
      <PageIntro number="04" eyebrow="Selected project" title="Built for" accent="real-world use." description="A project built with curiosity, AI tools, and a focus on creating a clear, practical user experience." />
      <section className="bg-[#f1ebff] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <a href="https://pizza-ride01-main.vercel.app/" target="_blank" rel="noreferrer" className="focus-ring reveal group block overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-[0_24px_60px_-40px_#5d3c8a] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_-38px_#5d3c8a]" data-testid="link-project-pizza-ride">
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-[#5d2f96] p-8 sm:p-12">
                <div className="absolute -right-14 -top-14 h-64 w-64 rounded-full border-[22px] border-[#e6c65b]/90" />
                <div className="absolute -bottom-28 -left-12 h-72 w-72 rounded-full border-[30px] border-[#8b5ad0]/70" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between text-white/70"><span className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold uppercase tracking-[.18em]">Live project</span><ExternalLink className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
                   <div><p className="font-display text-5xl font-semibold tracking-[-.06em] text-white sm:text-7xl">Pizza<br /><span className="text-[#f5d96e]">Ride</span></p><p className="mt-4 text-sm font-medium text-white/65">Simple choices. Warm slices. A seamless checkout.</p></div>
                </div>
              </div>
              <div className="flex flex-col justify-between p-8 sm:p-12">
                 <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#a08ab8]">Website / E-commerce</p><h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#45315e]">Pizza Ride Website</h2><p className="mt-5 max-w-md text-base leading-7 text-[#746783]">A streamlined pizza ordering experience with WhatsApp checkout.</p></div>
                 <div className="mt-12 flex items-center justify-between border-t border-violet-100 pt-5 text-sm font-bold text-[#6f3cc4]"><span>View live website</span><ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </div>
          </a>
        </div>
      </section>
    </>
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
    <>
      <PageIntro number="05" eyebrow="Contact" title="Let’s build" accent="something meaningful." description="Have an idea, a project, or a question? I would be glad to hear from you." />
      <section className="bg-white px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div className="reveal">
             <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8050ce]">Get in touch</p>
            <a href="mailto:kritikabhagoria151@gmail.com" className="focus-ring mt-8 inline-flex items-center gap-3 text-sm font-bold text-[#5e389d] underline decoration-violet-200 underline-offset-8 transition-colors hover:text-[#33264e]" data-testid="link-email"><Mail className="h-4 w-4" /> kritikabhagoria151@gmail.com</a>
            <div className="mt-12 rounded-3xl bg-[#f6f1ff] p-7">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9577bc]">Based in</p>
              <p className="mt-3 inline-flex items-center gap-2 font-display text-2xl font-semibold text-[#45315e]"><MapPin className="h-5 w-5 text-[#8050ce]" /> Pundri, Haryana</p>
            </div>
          </div>
          <form onSubmit={handleContact} className="reveal reveal-delay-1 rounded-[2rem] border border-violet-100 bg-[#faf8ff] p-6 sm:p-9" data-testid="form-contact">
            <div className="grid gap-6 sm:grid-cols-2">
               <label className="text-sm font-semibold text-[#45315e]">Name<input required name="name" type="text" placeholder="Your full name" className="focus-ring mt-2 w-full rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-name" /></label>
               <label className="text-sm font-semibold text-[#45315e]">Email address<input required name="email" type="email" placeholder="you@example.com" className="focus-ring mt-2 w-full rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-email" /></label>
            </div>
             <label className="mt-6 block text-sm font-semibold text-[#45315e]">Project details<textarea required name="message" rows={6} placeholder="Tell me about your idea or project..." className="focus-ring mt-2 w-full resize-none rounded-xl border border-violet-100 bg-white px-4 py-3.5 text-sm font-normal text-[#45315e] outline-none transition-colors placeholder:text-[#b1a5bf] focus:border-[#9a73da]" data-testid="input-message" /></label>
             <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button type="submit" className="focus-ring inline-flex items-center rounded-full bg-[#6f3cc4] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#57309f]" data-testid="button-send-message">{sent ? <><Check className="mr-2 h-4 w-4" /> Draft prepared</> : <>Open email draft <ArrowUpRight className="ml-2 h-4 w-4" /></>}</button><span className="text-xs text-[#9a8da9]">Your email app will open</span></div>
          </form>
        </div>
      </section>
    </>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Shell>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={Home} />
          <Route path="/journey" component={Home} />
          <Route path="/skills" component={Home} />
          <Route path="/projects" component={Home} />
          <Route path="/contact" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Shell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;