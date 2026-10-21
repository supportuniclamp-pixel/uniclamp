import { Layout, Hero, Heading, ProjectCards } from '@/components/site';
import { projects as defaultProjects, images } from '@/lib/site-data';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let p: any = null;
  let allProjects: any[] = [];

  try {
    await dbConnect();
    const dbProject = await Project.findOne({ slug: decodedSlug, isActive: true }).lean();
    if (dbProject) {
      p = JSON.parse(JSON.stringify(dbProject));
    }
    const dbList = await Project.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
    if (dbList && dbList.length > 0) {
      allProjects = JSON.parse(JSON.stringify(dbList));
    }
  } catch (error) {
    console.error("Error fetching project:", error);
  }

  // Fallback to static site data if not in database
  if (!p) {
    p = defaultProjects.find((item) => item.slug === decodedSlug);
  }

  if (allProjects.length === 0) {
    allProjects = defaultProjects;
  }

  if (!p) {
    return (
      <Layout>
        <Hero title="Project not found" description="Browse our illustrative project applications." />
      </Layout>
    );
  }

  const projectImage = p.image || images.factory;
  const overviewTitle = p.overviewTitle || "Engineering the connections.";
  const detailedText = p.detailedDescription || `${p.description || ''} This illustrative application explores how coordinated supports and fixing components can meet complex installation needs.`;
  const challengeText = p.challenge || "Coordinate multiple service installations while maintaining accessible, adaptable and reliable support structures.";
  const approachText = p.approach || "Combine modular strut channels, pipe supports and compatible fixing systems to develop an integrated solution around the project specification.";
  const statusText = p.status || "Illustrative application";

  return (
    <Layout>
      <Hero
        title={p.name}
        label={`${p.category || 'Project'} / ${p.location || 'Site'}`}
        image={projectImage}
        description={p.description || ''}
      />
      <section className="section">
        <div className="container split items-start">
          <div className="flex flex-col">
            <Heading label="PROJECT OVERVIEW" title={overviewTitle} />
            <p className="copy animate-fade-up">{detailedText}</p>
            <h3 className="text-primary text-xl font-semibold mt-8 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary inline-block rounded-xs"></span>
              The challenge
            </h3>
            <p className="copy animate-fade-up delay-100">{challengeText}</p>
            <h3 className="text-primary text-xl font-semibold mt-8 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary inline-block rounded-xs"></span>
              Our approach
            </h3>
            <p className="copy animate-fade-up delay-200">{approachText}</p>
          </div>
          <div className="flex flex-col">
            <div className="w-full overflow-hidden rounded-md bg-muted">
              <img
                className="w-full h-auto max-h-[360px] object-cover rounded-md"
                src={projectImage}
                alt={p.name}
                loading="lazy"
                width="1000"
                height="800"
              />
            </div>
            <table className="detail-table">
              <tbody>
                <tr>
                  <td>Industry</td>
                  <td>{p.category}</td>
                </tr>
                <tr>
                  <td>Sample location</td>
                  <td>{p.location}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{statusText}</td>
                </tr>
              </tbody>
            </table>
            <p className="notice">
              Client, completion date and measured results require verified project information.
            </p>
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="container">
          <Heading label="MORE APPLICATIONS" title="Related projects" />
          <ProjectCards items={allProjects.filter((x: any) => x.slug !== p.slug).slice(0, 3)} />
        </div>
      </section>
    </Layout>
  );
}
