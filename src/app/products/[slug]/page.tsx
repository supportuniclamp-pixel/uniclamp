import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Layout, Hero, Heading, ProductCards } from '@/components/site';
import { Button } from '@/components/ui/button';
import { products, images, pageHead } from '@/lib/site-data';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let p = null;
  try {
    await dbConnect();
    const decodedSlug = decodeURIComponent(slug); // just in case
    const productData = await Product.findOne({ slug: decodedSlug }).populate({ path: 'category', model: Category }).lean();
    if (productData) {
      p = JSON.parse(JSON.stringify(productData));
    }
  } catch (e) {
    console.error("Error fetching product:", e);
  }

  if (!p) return <Layout><Hero title="Product not found" description="Explore our product range to find the right solution." /></Layout>;

  return <Layout><Hero title={p.name} label={p.category?.name || 'Product'} description={p.shortDescription || p.description} /><section className="section"><div className="container split"><img src={p.images?.[0] || images.products} className="detail-image" alt={p.name} width="1536" height="1024" style={{ objectFit: 'cover' }} /><div><Heading label="TECHNICAL OVERVIEW" title={p.name} /><p className="copy">{p.description}</p><table className="detail-table"><tbody>
    {p.specifications?.length > 0 ? (
      p.specifications.map((spec: any, i: number) => (
        <tr key={i}><td>{spec.key}</td><td>{spec.value}</td></tr>
      ))
    ) : (
      <><tr><td>Dimensions</td><td>Available to project specification</td></tr><tr><td>Load ratings</td><td>Requires technical confirmation</td></tr><tr><td>Technical datasheet</td><td>Request from our team</td></tr></>
    )}
  </tbody></table><Button variant="brand" asChild><Link href="/contact">Request Product Enquiry <ArrowUpRight /></Link></Button></div></div></section><section className="section bg-muted"><div className="container"><Heading label="EXPLORE MORE" title="Related solutions" /><ProductCards /></div></section></Layout>;
}
