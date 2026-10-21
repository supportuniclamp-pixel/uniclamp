"use client";
import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Layout, Hero, Heading, ProjectCards } from '@/components/site';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { projects as defaultProjects, images } from '@/lib/site-data';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [projectList, setProjectList] = useState<any[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const activeProjects = data.filter((p: any) => p.isActive);
          if (activeProjects.length > 0) {
            setProjectList(activeProjects);
          }
        }
      })
      .catch(err => console.error("Error loading projects:", err))
      .finally(() => setLoading(false));
  }, []);

  // Standard categories list + dynamic categories from added projects
  const standardCategories = ['All', 'Industrial', 'Infrastructure', 'Commercial', 'Healthcare', 'Hospitality', 'Energy'];
  const customCategories = Array.from(new Set(projectList.map(p => p.category?.trim()))).filter(c => c && !standardCategories.some(sc => sc.toLowerCase() === c.toLowerCase()));
  const filterCategories = [...standardCategories, ...customCategories];

  const filteredProjects = projectList.filter(p => {
    if (filter === 'All') return true;
    return (p.category?.trim() || '').toLowerCase() === filter.trim().toLowerCase();
  });

  return (
    <Layout>
      <Hero
        title="Supporting bigger ambitions."
        label="OUR PROJECTS"
        image={images.building}
        description="From complex industrial environments to modern infrastructure, discover where precision-engineered systems make a difference."
      />
      <section className="section">
        <div className="container">
          <div className="split mb-14">
            <div>
              <Heading label="ENGINEERING IN ACTION" title="Built for demanding projects." />
              <p className="copy">
                Every installation brings a different challenge. Our support and fixing systems are designed to help connect disciplines, simplify assembly and create reliable results.
              </p>
            </div>
            <div className="checklist">
              {[
                'Industrial Manufacturing',
                'Heavy-Duty Pipe Supports',
                'Infrastructure Solutions',
                'Modular Framing Systems',
                'Commercial Building Services',
                'Custom Engineering',
              ].map(x => (
                <span key={x}>
                  <CheckCircle2 />
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="filter-bar" aria-label="Project categories">
            {filterCategories.map(x => (
              <Button
                key={x}
                variant={filter === x ? 'default' : 'outline'}
                onClick={() => setFilter(x)}
                aria-pressed={filter === x}
              >
                {x}
              </Button>
            ))}
          </div>
          {loading ? (
            <LoadingSpinner size="md" label="Loading projects..." />
          ) : filteredProjects.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">No projects found in this category.</p>
          ) : (
            <ProjectCards items={filteredProjects} />
          )}
          <p className="notice">Illustrative projects and locations, not verified customer references.</p>
        </div>
      </section>
    </Layout>
  );
}
