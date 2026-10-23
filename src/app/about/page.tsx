import Link from 'next/link';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Users2, 
  Workflow, 
  HeartHandshake, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { Layout, Hero, Heading } from '@/components/site';
import { images } from '@/lib/site-data';
import { OurStoryExpandable } from '@/components/our-story-expandable';
import { AboutUsExpandable } from '@/components/about-us-expandable';

export const metadata = {
  title: 'About Us | Pipe Supports and Fixing Systems Private Limited (UNIclamp)',
  description: 'Engineered for Strength. Designed for Reliability. Built on Trust. Learn about our vision, mission, story, and core strengths in pipe support and fixing solutions.',
};

const team = [
  { name: 'Khalid Khalifa', title: 'General Manager', image: 'https://i.pravatar.cc/300?img=11' },
  { name: 'Peter Prince', title: 'Regional Sales Manager- MEA', image: 'https://i.pravatar.cc/300?img=12' },
  { name: 'Uma Rani', title: 'Finance Controller', image: 'https://i.pravatar.cc/300?img=5' },
  { name: 'Shivangi Mahindru', title: 'Sr. HR Specialist', image: 'https://i.pravatar.cc/300?img=10' },
  { name: 'Piyusha Chavan', title: 'Supply Chain Manager', image: 'https://i.pravatar.cc/300?img=9' },
  { name: 'Anand Naik', title: 'Plant Manager', image: 'https://i.pravatar.cc/300?img=13' }
];

const coreStrengths = [
  {
    icon: Award,
    title: 'Quality Commitment',
    desc: 'Focus on dependable products and consistent quality.'
  },
  {
    icon: Layers,
    title: 'Product Range',
    desc: 'Pipe clamps, strut channels, accessories, rubber support inserts, and anti-vibration products.'
  },
  {
    icon: Target,
    title: 'Customer Focus',
    desc: 'Solutions tailored to project requirements and application needs.'
  },
  {
    icon: HeartHandshake,
    title: 'Reliable Support',
    desc: 'Responsive service and a commitment to long-term business relationships.'
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    desc: 'An ongoing focus on better products, processes, and customer value.'
  }
];

const missionPillars = [
  {
    num: '01',
    title: 'Quality Excellence',
    desc: 'Maintaining consistent product quality and reliability.'
  },
  {
    num: '02',
    title: 'Customer Satisfaction',
    desc: 'Understanding customer needs and delivering practical, value-driven solutions.'
  },
  {
    num: '03',
    title: 'Innovation',
    desc: 'Continuously improving our products, designs, and processes.'
  },
  {
    num: '04',
    title: 'Reliability',
    desc: 'Providing dependable products and responsive customer service.'
  },
  {
    num: '05',
    title: 'Long-Term Partnerships',
    desc: 'Building lasting relationships through trust, transparency, and professionalism.'
  },
  {
    num: '06',
    title: 'Continuous Growth',
    desc: 'Embracing new technologies and responsible business practices to create sustainable value.'
  }
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        label="ABOUT US — ESTABLISHED 2026"
        title={
          <>
            Engineered for Strength.{' '}
            <span className="text-secondary block">Designed for Reliability.</span>
          </>
        }
        description="Pipe Supports and Fixing Systems Private Limited is focused on delivering dependable, high-quality pipe support and fixing solutions for industrial, commercial, and infrastructure applications. Built on trust, driven by engineering excellence."
        image={images.engineer}
      />

      {/* Corporate Tagline Banner */}
      <section className="bg-primary text-primary-foreground py-6 border-b border-primary-foreground/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-bold tracking-wider text-xs uppercase text-secondary">
              Corporate Identity &amp; Heritage
            </span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-sm font-semibold text-white/95">
              Pipe Supports and Fixing Systems Private Limited
            </span>
          </div>
          <div className="text-xs font-medium text-white/80 italic tracking-wide">
            &ldquo;Supporting Every Connection. Strengthening Every Project.&rdquo;
          </div>
        </div>
      </section>

      {/* Who We Are & Overview */}
      <section className="section">
        <div className="container split items-center">
          <div>
            <div className="eyebrow text-primary">WHO WE ARE</div>
            <h2 className="section-title mt-4 mb-6">
              Engineering solutions that power modern infrastructure.
            </h2>
            <AboutUsExpandable />
          </div>
          <div className="relative">
            <img
              className="detail-image shadow-xl"
              src={images.factory}
              alt="Pipe Supports manufacturing environment"
              loading="lazy"
              width="1920"
              height="1024"
              style={{ maxHeight: '440px', objectFit: 'cover' }}
            />
            <div className="image-label">
              <ShieldCheck size={28} />
              <div>
                Engineered for Strength.
                <br />
                <strong>Built on Trust.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="section bg-muted/70 relative">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow text-primary justify-center">OUR GUIDING PRINCIPLES</div>
            <h2 className="section-title mt-3">Vision &amp; Mission</h2>
            <p className="copy mt-3 text-sm">
              The strategic foundation and core commitments directing our products, people, and customer partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Vision Card */}
            <div className="bg-white rounded-xl p-8 md:p-10 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary group-hover:bg-secondary transition-colors duration-300" />
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Compass size={26} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground block">
                      LOOKING AHEAD
                    </span>
                    <h3 className="text-2xl font-bold text-primary m-0">Our Vision</h3>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/60 border border-primary/10 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">Official Vision Statement:</div>
                  <p className="text-sm font-semibold text-primary italic leading-relaxed">
                    &ldquo;To become a trusted name in pipe supports and fixing systems, supporting progress through quality, innovation, and engineering excellence.&rdquo;
                  </p>
                </div>

                <div className="space-y-4 text-sm copy text-muted-foreground leading-relaxed">
                  <p>
                    At Pipe Supports and Fixing Systems Private Limited, our vision is to become a trusted and recognized leader in the pipe supports and fixing systems industry by delivering innovative, reliable, and high-quality engineering solutions.
                  </p>
                  <p>
                    We aspire to set new benchmarks in product quality, technical excellence, and customer satisfaction through continuous innovation, advanced manufacturing practices, and a commitment to reliability. Our goal is to support the growth of industrial, commercial, and infrastructure sectors with durable and efficient solutions that meet evolving industry requirements.
                  </p>
                  <p>
                    We envision building long-term partnerships with our customers by understanding their needs, delivering consistent value, and maintaining the highest standards of integrity and professionalism.
                  </p>
                  <p>
                    Through sustainable growth, continuous improvement, and a customer-first approach, we aim to contribute to the development of safer, stronger, and more efficient piping systems across diverse applications.
                  </p>
                  <p className="font-semibold text-primary pt-2">
                    Our Vision: To become a trusted name in pipe supports and fixing systems, supporting progress through quality, innovation, and engineering excellence.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <CheckCircle2 size={16} className="text-secondary" />
                Safer • Stronger • More Efficient Piping Systems
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-xl p-8 md:p-10 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary" />
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 text-primary flex items-center justify-center font-bold">
                    <Target size={26} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground block">
                      OUR PURPOSE
                    </span>
                    <h3 className="text-2xl font-bold text-primary m-0">Our Mission</h3>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/60 border border-secondary/30 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-1">Official Mission Statement:</div>
                  <p className="text-sm font-semibold text-primary italic leading-relaxed">
                    &ldquo;To engineer reliable support, deliver lasting quality, and build stronger partnerships through innovation and customer commitment.&rdquo;
                  </p>
                </div>

                <div className="space-y-4 text-sm copy text-muted-foreground leading-relaxed">
                  <p>
                    At Pipe Supports and Fixing Systems Private Limited, our mission is to deliver high-quality, reliable, and cost-effective pipe support and fixing solutions that meet the diverse needs of industrial, commercial, and infrastructure projects.
                  </p>
                  <p>
                    We are committed to providing products that combine strength, durability, precision, and ease of installation while maintaining a strong focus on quality, safety, and customer satisfaction.
                  </p>
                  <p>
                    Through our product range, including Pipe Clamps, Strut Channels and Accessories, Rubber Support Inserts, and Anti-Vibration Products, we strive to offer dependable solutions that support efficient piping installations and meet the evolving requirements of our customers.
                  </p>
                  <div>
                    <strong className="text-primary block mb-2 font-semibold">We aim to achieve our mission through:</strong>
                    <ul className="space-y-2 list-none pl-0">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Quality Excellence:</strong> Maintaining consistent product quality and reliability.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Customer Satisfaction:</strong> Understanding customer needs and delivering practical, value-driven solutions.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Innovation:</strong> Continuously improving our products, designs, and processes.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Reliability:</strong> Providing dependable products and responsive customer service.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Long-Term Partnerships:</strong> Building lasting relationships through trust, transparency, and professionalism.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span><strong>Continuous Growth:</strong> Embracing new technologies and responsible business practices to create sustainable value.</span>
                      </li>
                    </ul>
                  </div>
                  <p className="pt-2">
                    Our mission is to become a dependable partner for contractors, consultants, distributors, OEMs, and industrial customers by delivering solutions they can trust.
                  </p>
                  <p className="font-semibold text-primary">
                    Our Mission: To engineer reliable support, deliver lasting quality, and build stronger partnerships through innovation and customer commitment.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <CheckCircle2 size={16} className="text-secondary" />
                Reliable Support • Lasting Quality • Stronger Partnerships
              </div>
            </div>
          </div>

          {/* How We Achieve Our Mission */}
          <div className="mt-14 pt-12 border-t border-border">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-1">
                EXECUTION EXCELLENCE
              </span>
              <h3 className="text-2xl font-bold text-primary">How We Achieve Our Mission</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missionPillars.map(p => (
                <div
                  key={p.num}
                  className="bg-white p-6 rounded-lg border border-border shadow-xs hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-secondary tracking-widest bg-primary px-2.5 py-1 rounded">
                      {p.num}
                    </span>
                    <Sparkles size={16} className="text-primary/40" />
                  </div>
                  <h4 className="font-bold text-primary text-base mb-2">{p.title}</h4>
                  <p className="text-xs copy text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="split items-center">
            <div className="order-2 md:order-1">
              <img
                src={images.engineer}
                alt="Engineering expertise at Pipe Supports and Fixing Systems"
                className="detail-image shadow-xl"
                loading="lazy"
                width="1000"
                height="800"
                style={{ maxHeight: '480px', objectFit: 'cover' }}
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="eyebrow text-primary">OUR JOURNEY &amp; FOUNDATION</div>
              <h2 className="section-title mt-4 mb-6">
                Our Story: Pipe Supports and Fixing Systems Private Limited
              </h2>
              <OurStoryExpandable />
            </div>
          </div>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="section bg-muted/60">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="eyebrow text-primary justify-center">OUR COMPETITIVE EDGE</div>
            <h2 className="section-title mt-3">Our Core Strengths</h2>
            <p className="copy mt-3 text-sm">
              The cornerstones that define our products, support our partners, and deliver reliable value across every installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreStrengths.map((item, idx) => (
              <div
                key={item.title}
                className={`bg-white p-7 rounded-xl border border-border shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2.5">{item.title}</h3>
                  <p className="text-xs copy text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-border/60 flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                  <CheckCircle2 size={13} className="text-secondary" />
                  Verified Standard
                </div>
              </div>
            ))}
          </div>

          {/* Slogan Banner */}
          <div className="mt-12 p-8 rounded-xl bg-primary text-primary-foreground text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
                YOUR TRUSTED PARTNER FOR PIPE SUPPORT &amp; FIXING SOLUTIONS
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white m-0">
                Pipe Supports and Fixing Systems Private Limited
              </h3>
              <p className="text-xs text-white/80 mt-1">
                Supporting Every Connection. Strengthening Every Project.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-md bg-secondary text-secondary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              >
                Explore Products <ArrowUpRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                Contact Us <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section text-center">
        <div className="container">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="eyebrow text-primary justify-center">EXECUTIVE LEADERSHIP</div>
            <h2 className="section-title mt-3">Meet our Leadership Team</h2>
            <p className="copy mt-3 text-sm">
              Driven by expertise, united by purpose — guided by decades of engineering, supply chain, and operational leadership.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '30px',
              textAlign: 'center'
            }}
          >
            {team.map(member => (
              <div key={member.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '1.25rem',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
                  }}
                />
                <h4
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    fontSize: '1.05rem',
                    marginBottom: '0.35rem',
                    lineHeight: '1.25'
                  }}
                >
                  {member.name.split(' ').map((n, i) => (
                    <span key={i} style={{ display: 'block' }}>{n}</span>
                  ))}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#666', maxWidth: '140px', lineHeight: '1.4' }}>
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
