import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Layout, Hero, Heading, ProductCards } from '@/components/site';
import { Button } from '@/components/ui/button';
import { products, images, pageHead } from '@/lib/site-data';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let p = null;
  let relatedProducts: any[] = [];
  try {
    await dbConnect();
    const decodedSlug = decodeURIComponent(slug); // just in case
    const productData = await Product.findOne({ slug: decodedSlug }).populate({ path: 'category', model: Category }).lean();
    if (productData) {
      p = JSON.parse(JSON.stringify(productData));
      
      const categoryId = p.category?._id;
      let query: any = { _id: { $ne: p._id }, isActive: true };
      if (categoryId) {
        query.category = categoryId;
      }
      
      let fetchedRelated = await Product.find(query).populate({ path: 'category', model: Category }).sort({ createdAt: -1 }).limit(10).lean();
      
      // If not enough products in the same category, fetch other active products
      if (fetchedRelated.length === 0) {
        fetchedRelated = await Product.find({ _id: { $ne: p._id }, isActive: true }).populate({ path: 'category', model: Category }).sort({ createdAt: -1 }).limit(10).lean();
      }
      relatedProducts = JSON.parse(JSON.stringify(fetchedRelated));
    }
  } catch (e) {
    console.error("Error fetching product:", e);
  }

  if (!p) return <Layout><Hero title="Product not found" description="Explore our product range to find the right solution." /></Layout>;

  return (
    <Layout>
      <Hero title={p.name} label={p.category?.name || 'Product'} description={p.shortDescription || p.description} />
      <section className="section">
        <div className="container split">
          <img src={p.images?.[0] || images.products} className="detail-image" alt={p.name} width="1536" height="1024" style={{ objectFit: 'cover' }} />
          <div>
            <Heading label="TECHNICAL OVERVIEW" title={p.name} />
            <p className="copy">{p.description}</p>

            <div className="mt-8">
              <Button variant="brand" size="lg" asChild>
                <Link href="/contact">Request Product Enquiry <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Standalone Specifications and Packaging Section */}
      <section className="section bg-[#f8faf9] border-t border-b border-gray-200/80">
        <div className="container">
          <Heading label="TECHNICAL DETAILS" title="Specifications and Packaging" />
          
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <details className="group" open>
              <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-gray-900 bg-gray-50/70 hover:bg-gray-100/70 transition-colors select-none list-none border-b border-gray-200/60">
                <span className="text-base sm:text-lg font-heading flex items-center gap-2.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
                  Specifications and Packaging
                </span>
                <span className="text-xl text-gray-400 group-open:rotate-90 transition-transform duration-200">
                  ›
                </span>
              </summary>

              <div className="p-6 md:p-8 space-y-8">
                {p.specificationImage ? (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      Technical Drawing / Packaging Specification Chart
                    </span>
                    <div className="border border-gray-200 rounded-xl p-4 bg-[#fafbfc] flex items-center justify-center overflow-hidden">
                      <img 
                        src={p.specificationImage} 
                        alt={`${p.name} Specifications and Packaging`} 
                        className="max-h-[500px] w-auto max-w-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                    Detailed technical packaging drawing or diagram available upon request.
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                    Technical Specifications
                  </span>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left text-sm border-collapse">
                      <tbody>
                        {p.specifications?.length > 0 ? (
                          p.specifications.map((spec: any, i: number) => (
                            <tr key={i} className="border-b last:border-b-0 border-gray-200/80">
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100 bg-white">
                                {spec.key}
                              </td>
                              <td className="p-4 text-gray-700 italic font-normal bg-white">
                                {spec.value}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <>
                            <tr className="border-b border-gray-200/80">
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100">Type</td>
                              <td className="p-4 text-gray-700 italic font-normal">Anti Vibration Isolator</td>
                            </tr>
                            <tr className="border-b border-gray-200/80">
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100">Sizes</td>
                              <td className="p-4 text-gray-700 italic font-normal">Min – 50kg, 100kg | Max – Customization available</td>
                            </tr>
                            <tr className="border-b border-gray-200/80">
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100">Finish</td>
                              <td className="p-4 text-gray-700 italic font-normal">Painted</td>
                            </tr>
                            <tr className="border-b border-gray-200/80">
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100">Min Load</td>
                              <td className="p-4 text-gray-700 italic font-normal">As per Size</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-bold text-gray-800 w-1/4 border-r border-gray-100">Max Load</td>
                              <td className="p-4 text-gray-700 italic font-normal">As per Size</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section bg-muted">
          <div className="container">
            <Heading label="EXPLORE MORE" title="Related solutions" />
            <ProductCards items={relatedProducts} />
          </div>
        </section>
      )}
    </Layout>
  );
}

