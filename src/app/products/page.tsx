"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Minus, Layers, Circle, Wrench, ArrowUpRight } from 'lucide-react';
import { Layout, Hero, Heading, ProductCards } from '@/components/site';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Products() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setDbProducts(list);
        if (list.length > 0) {
          const firstCatId = list[0]?.category?._id || 'uncategorized';
          setExpanded(firstCatId);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Group products by category
  const groupedCategories: Record<string, { name: string, description: string, products: any[] }> = {};

  dbProducts.forEach(p => {
    const catId = p.category?._id || 'uncategorized';
    if (!groupedCategories[catId]) {
      groupedCategories[catId] = {
        name: p.category?.name || 'Other Products',
        description: p.category?.description || 'Various industrial solutions.',
        products: []
      };
    }
    groupedCategories[catId].products.push(p);
  });

  const categoriesList = Object.entries(groupedCategories);

  return (
    <Layout>
      <Hero label="PRECISION. STRENGTH. PERFORMANCE." title="Our Product Range" description="Purpose-built pipe supports, modular channels and fixing solutions for the connections that matter.">
        <div className="mt-8">
          <Button variant="brand" size="lg" asChild>
            <a href="/UNIclamp_Catalog.pdf" target="_blank" rel="noopener noreferrer">Download Product Catalog <ArrowUpRight /></a>
          </Button>
        </div>
      </Hero>
      <section className="section">
        <div className="container">
          <Heading label="FIND YOUR SOLUTION" title="Engineered for your application." />
          {loading ? (
            <LoadingSpinner size="md" label="Loading product categories..." />
          ) : categoriesList.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No products found.</p>
          ) : (
            categoriesList.map(([catId, cat], i) => (
              <div className="accordion-item" key={catId}>
                <Button
                  variant="ghost"
                  className="accordion-trigger"
                  aria-expanded={expanded === catId}
                  aria-controls={`panel-${catId}`}
                  onClick={() => setExpanded(expanded === catId ? null : catId)}
                >
                  {i % 3 === 0 ? <Circle /> : i % 3 === 1 ? <Layers /> : <Wrench />}
                  <div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                  </div>
                  {expanded === catId ? <Minus /> : <Plus />}
                </Button>
                {expanded === catId && (
                  <div className="accordion-content" id={`panel-${catId}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '26px', padding: '24px 0 36px 0', width: '100%' }}>
                    {cat.products.map((p, idx) => (
                      <Link
                        key={p.slug || idx}
                        href={`/products/${p.slug}`}
                        className="product-card group flex flex-col h-full"
                      >
                        <div className="product-card-media">
                          <span className="product-card-num">0{idx + 1}</span>
                          <span className="product-card-status">Standard Spec</span>
                          <div className="product-card-img-wrap">
                            <img
                              src={p.images?.[0] || '/assets/products.jpg'}
                              alt={p.name}
                              loading="lazy"
                              width="600"
                              height="450"
                              className="product-card-img"
                            />
                          </div>
                        </div>
                        <div className="product-card-body">
                          <span className="product-card-category" title={cat.name}>
                            {cat.name}
                          </span>
                          <h3 className="product-card-title">{p.name}</h3>
                          <p className="product-card-desc">
                            {p.shortDescription || p.description || 'Engineered industrial clamp and fixing solution built for dependable performance and heavy-duty structural stability.'}
                          </p>
                          <div className="product-card-footer">
                            <span className="product-card-action-text font-semibold">View Specifications</span>
                            <span className="product-card-action-btn">
                              <ArrowUpRight size={16} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      <section className="section bg-muted">
        <div className="container">
          <Heading label="THE ESSENTIALS" title="Built to work together." />
          <ProductCards items={dbProducts.length > 0 ? dbProducts : undefined} />
        </div>
      </section>
    </Layout>
  );
}
