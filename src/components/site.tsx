"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X, Factory, Building2, Zap, Wrench, ShieldCheck, CheckCircle2, Cog, Leaf, Mail, Phone, MessageCircle, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { images, projects, products } from '@/lib/site-data';
import { Logo } from '@/components/Logo';
export { Logo };
const links = [{ to: '/', name: 'Home' }, { to: '/about', name: 'About' }, { to: '/projects', name: 'Projects' }, { to: '/products', name: 'Products' }, { to: '/certifications', name: 'Certifications' }, { to: '/contact', name: 'Contact Us' }] as const;

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { threshold: 0.08, rootMargin: '40px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.99)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleNavClick = () => {
    setOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(l => (
            <Link
              key={l.to}
              href={l.to}
              scroll={true}
              onClick={handleNavClick}
              className={pathname === l.to ? 'active' : ''}
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <Button variant="brand" asChild className="header-cta">
          <Link href="/contact" onClick={handleNavClick}>
            Get In Touch <ArrowUpRight />
          </Link>
        </Button>
        <Button
          variant="heroOutline"
          size="icon"
          className="mobile-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Logo />
          {links.map(l => (
            <Link key={l.to} href={l.to} onClick={handleNavClick}>
              {l.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
const HERO_SLIDES = [
  {
    url: typeof images.factory === 'string' ? images.factory : (images.factory as any).src,
    alt: 'High precision industrial pipe manufacturing and storage plant',
  },
  {
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1920&q=80',
    alt: 'Heavy duty steel pipes and structural support assemblies',
  },
  {
    url: typeof images.products === 'string' ? images.products : (images.products as any).src,
    alt: 'Engineered pipe clamps and industrial fixing systems',
  },
  {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=80',
    alt: 'Industrial pipe plant engineering, fitting and inspection',
  },
];

export function Hero({
  title,
  description,
  label = 'ENGINEERED FOR EXCELLENCE',
  image = images.factory,
  home = false,
  children,
}: {
  title: React.ReactNode;
  description: string;
  label?: string;
  image?: string;
  home?: boolean;
  children?: React.ReactNode;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!home) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 3500); // 3.5 seconds transition
    return () => clearInterval(interval);
  }, [home]);

  return (
    <section className={`hero ${home ? '' : 'page-hero'}`}>
      {home ? (
        <div className="hero-slides-wrapper" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={`hero-slide-${idx}`}
              src={slide.url}
              alt={slide.alt}
              className={`hero-slide ${currentSlide === idx ? 'active' : ''}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              width="1920"
              height="1024"
            />
          ))}
          <div className="hero-indicators" role="tablist" aria-label="Slide indicators">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={`hero-dot-${idx}`}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`hero-indicator-dot ${currentSlide === idx ? 'active' : ''}`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <img
          src={image}
          alt="Industrial engineering and manufacturing environment"
          className="hero-img"
          width="1920"
          height="1024"
        />
      )}
      <div className="container hero-content">
        <div className="eyebrow animate-fade-up"><span className="badge-dot" />{label}</div>
        <h1 className="animate-fade-up delay-100">{title}</h1>
        <p className="hero-description animate-fade-up delay-200">{description}</p>
        {home && (
          <div className="flex flex-wrap gap-3 animate-fade-up delay-300">
            <Button variant="brand" size="lg" asChild className="btn-sheen hover-lift">
              <Link href="/products">Explore Products <ArrowUpRight /></Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild className="hover-lift">
              <Link href="/projects">View Projects <ArrowUpRight /></Link>
            </Button>
          </div>
        )}
        {children}
      </div>
      {home && (
        <div className="hero-bottom animate-fade-up delay-400">
          <div className="container flex justify-between gap-5">
            <div className="hero-detail">
              <span><ShieldCheck size={15} /> Precision engineered</span>
              <span><CheckCircle2 size={15} /> Built for reliability</span>
            </div>
            <a href="#intro" className="flex items-center gap-3 transition-transform hover:translate-y-1">Discover UNIclamp <span>↓</span></a>
          </div>
        </div>
      )}
    </section>
  );
}
export function Heading({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) { return <Reveal><div className="section-heading"><div><div className="eyebrow text-primary">{label}</div><h2 className="section-title">{title}</h2></div>{children}</div></Reveal>; }
export function ProductCards({ items = products, limit }: { items?: any[], limit?: number }) {
  const displayItems = limit ? items.slice(0, limit) : items;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="product-carousel-wrapper relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: displayItems.length > 3,
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
              SLIDE TO EXPLORE CATALOG ({displayItems.length} ITEMS)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-9 w-9 rounded-full border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous products"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-9 w-9 rounded-full border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
              onClick={() => api?.scrollNext()}
              aria-label="Next products"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        <CarouselContent className="-ml-6 py-2">
          {displayItems.map((p: any, i: number) => {
            const catName = p.category?.name || (typeof p.category === 'string' ? p.category : 'Pipe Supports');
            const imgSrc = p.image || (p.images && p.images[0]) || images.products;
            const description = p.shortDescription || p.description || 'Precision-engineered support system designed for high load capacity and lasting stability.';

            return (
              <CarouselItem key={p.slug || i} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <Link href={`/products/${p.slug}`} className="product-card group h-full">
                  <div className="product-card-media">
                    <span className="product-card-num">0{i + 1}</span>
                    <span className="product-card-status">Standard Spec</span>
                    <div className="product-card-img-wrap">
                      <img
                        src={imgSrc}
                        alt={p.name}
                        loading="lazy"
                        width="600"
                        height="450"
                        className="product-card-img"
                      />
                    </div>
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-category" title={catName}>
                      {catName}
                    </span>
                    <h3 className="product-card-title">{p.name}</h3>
                    <p className="product-card-desc">{description}</p>
                    <div className="product-card-footer">
                      <span className="product-card-action-text">Explore Specifications</span>
                      <span className="product-card-action-btn">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {count > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${current === idx
                  ? 'w-8 bg-primary shadow-sm'
                  : 'w-2 bg-primary/20 hover:bg-primary/40'
                  }`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}
export function ProjectCards({ items = projects.slice(0, 3) }: { items?: typeof projects }) { return <div className="product-grid">{items.map((p, i) => <Reveal delay={i * 100} key={p.slug} className="contents"><Link href={`/projects/${p.slug}`} className="project-card"><img src={p.image} alt={p.name} loading="lazy" width="1000" height="800" /><div className="project-info"><span className="card-kicker">{p.category}</span><h3>{p.name}</h3><p>{p.location}</p><ArrowUpRight className="project-arrow" size={23} /></div></Link></Reveal>)}</div>; }
export function Features() { return <div className="features">{[{ Icon: Cog, title: 'Engineering Expertise', copy: 'Thoughtful design. Practical solutions. Precision at every stage.' }, { Icon: ShieldCheck, title: 'Quality Without Compromise', copy: 'A detail-driven approach to materials, processes and performance.' }, { Icon: Wrench, title: 'Solutions That Fit', copy: 'Flexible systems developed for real-world project requirements.' }, { Icon: Leaf, title: 'Built for the Long Run', copy: 'Reliable products and considered engineering for lasting value.' }].map((f, i) => <Reveal delay={i * 100} key={f.title}><div className="feature"><f.Icon size={30} strokeWidth={1.5} /><h3>{f.title}</h3><p className="copy">{f.copy}</p></div></Reveal>)}</div>; }
export function IndustryStrip() { return <div className="industry-strip"><div className="container industry-inner"><span>Supporting progress<br />across industries</span>{[{ Icon: Factory, name: 'Manufacturing' }, { Icon: Building2, name: 'Construction' }, { Icon: Wrench, name: 'Infrastructure' }, { Icon: Zap, name: 'Energy & Utilities' }].map(x => <div key={x.name} className="industry-item"><x.Icon strokeWidth={1.5} />{x.name}</div>)}</div></div>; }
export function CTA() { return <section className="cta-band"><div className="container cta-inner"><div><div className="eyebrow mb-4"><span className="badge-dot" />YOUR NEXT PROJECT STARTS HERE</div><h2>Let’s build something <span className="text-stronger-animated">exceptional.</span></h2><p>The right products. The right expertise. <strong className="text-secondary font-semibold">A stronger partnership.</strong></p></div><Button variant="brand" size="lg" asChild className="btn-sheen hover-lift"><Link href="/contact">Contact Our Team <ArrowUpRight /></Link></Button></div></section>; }
export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <div className="mt-4">
              <span className="text-[11px] font-bold tracking-wider uppercase text-secondary block mb-1">
                Primary Business
              </span>
              <p className="text-[13px] font-semibold text-white/90 mb-2">
                Pipe Clamp Manufacturing &amp; Fixing Systems
              </p>
              <p className="text-[12px] opacity-75 leading-relaxed max-w-xs">
                Precision-engineered pipe supports and fixing systems. Connecting ideas. Supporting progress.
              </p>
            </div>
          </div>

          <div>
            <h3>Explore UNIclamp</h3>
            {links.slice(1).map(l => (
              <Link key={l.to} href={l.to}>{l.name}</Link>
            ))}
          </div>

          <div>
            <h3>Our Solutions</h3>
            {products.slice(0, 4).map(p => (
              <Link key={p.slug} href={`/products/${p.slug}`}>{p.name}</Link>
            ))}
            <Link href="/products" className="font-semibold text-secondary mt-2 inline-flex items-center gap-1">
              View All Products <ArrowRight size={12} />
            </Link>
          </div>

          <div>
            <h3>Registered Office</h3>
            <p className="text-[11px] font-bold text-white/95 uppercase tracking-wide mb-1">
              PIPE SUPPORTS AND FIXING SYSTEMS PRIVATE LIMITED
            </p>
            <p className="text-[12px] leading-relaxed opacity-80">
              F-C/705 Bhagirath Residency, Ganesh Nagar, Badlapur E.D., Ambarnath, Thane – 421503, Maharashtra, India
            </p>
          </div>
        </div>

        {/* Branded strip replicating reference UI with UNIclamp project color theme */}
        <div className="mt-12 pt-8 border-t border-white/15">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div className="shrink-0">
                <Logo size="lg" />
              </div>
            </div>

            <div className="shrink-0 flex items-center lg:justify-end">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 bg-secondary rounded-full" />
                <div>
                  <span className="font-heading font-extrabold text-base tracking-wider text-white block leading-none">
                    UNIclamp
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-secondary/90 font-medium block mt-1">
                    Quality &amp; Precision Pipe Supports
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-[12.5px] text-white/80 py-4 border-t border-white/10">
            <div className="inline-flex items-center gap-2">
              <MapPin size={15} className="text-secondary shrink-0" />
              <span>F-C/705 Bhagirath Residency, Ganesh Nagar, Badlapur, Thane – 421503, India</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Phone size={14} className="text-secondary shrink-0" />
              <a href="tel:+919579294968" className="hover:text-secondary transition-colors font-medium">
                +91 9579294968
              </a>
            </div>
            <div className="inline-flex items-center gap-2">
              <Mail size={14} className="text-secondary shrink-0" />
              <a href="mailto:pipesupportsystems@gmail.com" className="hover:text-secondary transition-colors font-medium">
                pipesupportsystems@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span>© 2026 UNIclamp. All rights reserved.</span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span>PIPE SUPPORTS &amp; FIXING SYSTEMS PVT LTD</span>
          </div>
          <span>Primary Business: Pipe Clamp Manufacturing</span>
        </div>
      </div>
    </footer>
  );
}
export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <CTA />
      <SiteFooter />
    </>
  );
}

