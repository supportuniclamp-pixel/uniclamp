import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Crosshair, Layers, Handshake } from 'lucide-react';
import { Layout, Hero, Heading, IndustryStrip, ProductCards, ProjectCards, Features } from '@/components/site';
import { Button } from '@/components/ui/button';
import { images, pageHead } from '@/lib/site-data';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Project from '@/models/Project';

export default async function Home() {
  let dbProducts = [];
  let dbProjects = [];
  try {
    await dbConnect();
    dbProducts = await Product.find({ isActive: true }).populate({ path: 'category', model: Category }).sort({ createdAt: -1 }).limit(12).lean();
    dbProducts = JSON.parse(JSON.stringify(dbProducts));

    dbProjects = await Project.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).limit(3).lean();
    dbProjects = JSON.parse(JSON.stringify(dbProjects));
  } catch (e) {
    console.error(e);
  }

  const statItems = [
    { n: 'Precision', s: 'In every component', Icon: Crosshair },
    { n: 'Strength', s: 'At every connection', Icon: ShieldCheck },
    { n: 'Versatility', s: 'Across applications', Icon: Layers },
    { n: 'Partnership', s: 'Throughout your project', Icon: Handshake },
  ];

  return (
    <Layout>
      <Hero
        home
        title={
          <>
            Engineering Better.
            <br />
            Building{' '}
            <span className="word-stronger-wrap">
              <span className="text-stronger-animated">Stronger.</span>
            </span>
          </>
        }
        description="Precision-engineered pipe supports and fixing systems. Built for demanding projects. Designed for lasting performance."
      />
      <IndustryStrip />
      <section className="section" id="intro">
        <div className="container">
          <div className="split items-start">
            <div className="intro-image">
              <img
                src={images.engineer}
                alt="An engineer working with industrial equipment"
                loading="lazy"
                width="1000"
                height="800"
              />
              <div className="image-label">
                <ShieldCheck size={28} />
                <div>
                  Precision in every detail.
                  <br />
                  <strong>Confidence in every connection.</strong>
                </div>
              </div>
            </div>
            <div className="intro-text">
              <div className="eyebrow text-primary">WHO WE ARE</div>
              <h2 className="section-title">
                Strong foundations.
                <br />
                <span className="text-shimmer">Smarter engineering.</span>
              </h2>
              <p className="copy">
                Established in 2026, <strong>Pipe Supports and Fixing Systems Private Limited</strong> (UNIclamp) is focused on providing dependable, high-quality pipe support and fixing solutions for industrial, commercial, and infrastructure applications.
              </p>
              <p className="copy mt-4">
                Engineered for Strength. Designed for Reliability. Built on Trust. From pipe clamps and strut channels to rubber support inserts and anti-vibration systems, we engineer support that lasts.
              </p>
              <Button variant="link" asChild className="px-0 mt-5 transition-transform hover:translate-x-1">
                <Link href="/about">Discover Our Story <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>
          <div className="stats">
            {statItems.map(x => (
              <div className="stat transition-all duration-300 hover:-translate-y-1 group" key={x.n}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:scale-105">
                  <x.Icon size={24} strokeWidth={1.75} />
                </div>
                <strong>{x.n}</strong>
                <span>{x.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="container">
          <Heading label="BUILT AROUND YOUR NEEDS" title="Our Product Solutions">
            <Button asChild variant="outline">
              <Link href="/products">All Products <ArrowUpRight /></Link>
            </Button>
          </Heading>
          <ProductCards items={dbProducts.length > 0 ? dbProducts : undefined} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Heading label="ENGINEERING IN ACTION" title="Supporting ambitious projects.">
            <Button asChild variant="outline">
              <Link href="/projects">Explore Projects <ArrowUpRight /></Link>
            </Button>
          </Heading>
          <ProjectCards items={dbProjects.length > 0 ? dbProjects : undefined} />
          <p className="notice">Illustrative project applications. Actual project references to be confirmed.</p>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="container">
          <Heading label="THE UNICLAMP DIFFERENCE" title="More than products. A better partner." />
          <Features />
        </div>
      </section>
      <section className="section">
        <div className="container split items-start">
          <div>
            <div className="eyebrow text-primary">QUALITY AT EVERY STEP</div>
            <h2 className="section-title mt-5">
              Built on trust.
              <br />
              <span className="text-shimmer">Driven by standards.</span>
            </h2>
          </div>
          <div>
            <p className="copy">
              Materials, manufacturing and attention to detail define the performance of every system. Explore our approach to quality, safety and continuous improvement.
            </p>
            <Button asChild variant="link" className="px-0 mt-4 transition-transform hover:translate-x-1">
              <Link href="/certifications">Explore Quality & Standards <ArrowUpRight /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
