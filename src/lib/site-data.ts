import factory from '@/assets/factory.jpg';
import productsImage from '@/assets/products.jpg';

export const images = { factory: typeof factory === 'string' ? factory : (factory as any).src, products: typeof productsImage === 'string' ? productsImage : (productsImage as any).src, building: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80', engineer: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1000&q=80' };
export const products = [
  {
    slug: 'pipe-supports', name: 'Industrial Pipe Supports', category: 'Support systems', description: 'Dependable support. Exceptional performance. Engineered for demanding pipe installations.', application: 'Mechanical installations, HVAC, industrial piping and building services.', material: 'Galvanized steel / stainless steel', icon: 'pipe',
    subProducts: [
      { name: 'Standard Pipe Clamp', description: 'Two-piece clamp with sound insulation lining for standard applications.', image: images.products },
      { name: 'Heavy Duty Clevis', description: 'Adjustable clevis hanger for suspending stationary pipelines.', image: images.products },
      { name: 'Roller Support', description: 'Pipe roller for lines subject to longitudinal movement.', image: images.products },
      { name: 'U-Bolt Fastener', description: 'Classic U-bolt for guiding or anchoring pipes to profiles.', image: images.products }
    ]
  },
  {
    slug: 'strut-channels', name: 'Strut & Channel Systems', category: 'Modular systems', description: 'Flexible, precision-built channel systems that bring strength to every connection.', application: 'Modular frames, cable containment and multi-service support structures.', material: 'Cold-formed galvanized steel', icon: 'strut',
    subProducts: [
      { name: 'Plain Strut Channel', description: 'Standard 41x41 profile for framing and supports.', image: images.products },
      { name: 'Slotted Strut Channel', description: 'Slotted back for flexible installation and adjustment.', image: images.products },
      { name: 'Cantilever Arm', description: 'Pre-welded wall bracket for side-mounting pipework.', image: images.products },
      { name: 'Channel Nut & Bolt', description: 'Spring nuts and hardware for secure channel connections.', image: images.products }
    ]
  },
  {
    slug: 'fixing-systems', name: 'Fixing & Fastening Systems', category: 'Fixing solutions', description: 'The right connection for every challenge. Durable components, built to hold.', application: 'Structural connections, brackets, suspended services and equipment fixing.', material: 'Zinc-plated steel / stainless steel', icon: 'fix',
    subProducts: [
      { name: 'Fixing Point Assembly', description: 'Stable fixing point assembly designed for pipe insulation.', image: images.products },
      { name: 'Expansion Device', description: 'Single support device to safely accommodate pipe expansion.', image: images.products },
      { name: 'Fixpoint Console', description: 'Flexible console module designed for high thermal forces.', image: images.products },
      { name: 'Expansion Guide Assembly', description: 'Double support assembly for stable pipe ceiling or floor routing.', image: images.products }
    ]
  },
  {
    slug: 'structural-components', name: 'Structural Components', category: 'Structural solutions', description: 'High-strength components for confident construction and reliable load support.', application: 'Industrial buildings, steelwork and equipment supports.', material: 'Structural steel', icon: 'strut',
    subProducts: [
      { name: 'Beam Clamps', description: 'Secure attachment to structural steel without drilling.', image: images.products },
      { name: 'Base Plates', description: 'Heavy duty base plates for floor or wall mounting.', image: images.products },
      { name: 'Cross Connectors', description: 'Rigid connection for intersecting channel profiles.', image: images.products },
      { name: 'Angle Brackets', description: '90-degree reinforced brackets for structural corners.', image: images.products }
    ]
  },
  {
    slug: 'safety-systems', name: 'Safety & Protection Systems', category: 'Safety solutions', description: 'Thoughtfully engineered protection for critical industrial installations.', application: 'Equipment protection and safe service installations.', material: 'Project-specific', icon: 'fix',
    subProducts: [
      { name: 'Seismic Bracing', description: 'Bracing components to protect installations against seismic events.', image: images.products },
      { name: 'Fire Stop Collars', description: 'Intumescent collars to seal pipe penetrations during fires.', image: images.products },
      { name: 'Vibration Isolators', description: 'Rubber-lined mounts to reduce transmission of vibration.', image: images.products },
      { name: 'Protective Sleeves', description: 'Jacketing solutions to protect insulated pipes from damage.', image: images.products }
    ]
  },
  {
    slug: 'custom-engineering', name: 'Custom Engineering Solutions', category: 'Custom fabrication', description: 'Purpose-built systems, developed around your project requirements.', application: 'Specialist industrial and infrastructure projects.', material: 'Specified with your engineering team', icon: 'pipe',
    subProducts: [
      { name: 'Prefabricated Skids', description: 'Fully assembled multi-service skids delivered to site.', image: images.products },
      { name: 'Custom Manifolds', description: 'Engineered headers and manifolds for fluid distribution.', image: images.products },
      { name: 'Specialty Brackets', description: 'Bespoke mounting solutions for unique architectural constraints.', image: images.products },
      { name: 'Heavy Equipment Mounts', description: 'Custom engineered bases for chillers, generators and tanks.', image: images.products }
    ]
  },
];
export const projects = [
  { slug: 'manufacturing-facility', name: 'Industrial Manufacturing Facility', location: 'Pune, India', category: 'Industrial', image: images.factory, description: 'Integrated pipe support and modular framing for a large-scale manufacturing environment.' },
  { slug: 'corporate-tower', name: 'Corporate Headquarters', location: 'Mumbai, India', category: 'Commercial', image: images.building, description: 'Coordinated fixing solutions for modern commercial building services.' },
  { slug: 'infrastructure-development', name: 'Infrastructure Development', location: 'Dubai, UAE', category: 'Infrastructure', image: images.engineer, description: 'Engineered connections and support systems for complex infrastructure installations.' },
  { slug: 'energy-infrastructure', name: 'Energy Infrastructure', location: 'Rajasthan, India', category: 'Energy', image: images.factory, description: 'Durable supports for demanding energy sector applications.' },
  { slug: 'healthcare-campus', name: 'Healthcare Campus', location: 'Bengaluru, India', category: 'Healthcare', image: images.building, description: 'Reliable building service systems for essential healthcare facilities.' },
  { slug: 'hospitality-development', name: 'Hospitality Development', location: 'Goa, India', category: 'Hospitality', image: images.building, description: 'Precisely coordinated installation systems for hospitality environments.' },
];
export const certificates = [
  {
    id: 'incorporation',
    name: 'Certificate of Incorporation',
    title: 'Ministry of Corporate Affairs (Govt. of India)',
    issuingBody: 'Central Registration Centre, MCA',
    certificateNumber: 'U46630MR2026PTC474840',
    issueDate: '23/03/2026',
    expiryDate: 'Perpetual',
    pdfUrl: '/incorporation-certificate.pdf',
    description: 'Certificate of Incorporation pursuant to sub-section (2) of section 7 and sub-section (1) of section 8 of the Companies Act, 2013 (18 of 2013). Corporate Identity Number (CIN): U46630MR2026PTC474840 · PAN: AAQCP8686C · TAN: PNEP43812G.',
    category: 'Government of India',
  },
  {
    id: 'udyam',
    name: 'Udyam Registration Certificate',
    title: 'Ministry of Micro, Small and Medium Enterprises',
    issuingBody: 'Ministry of MSME, Govt. of India',
    certificateNumber: 'UDYAM-MH-33-0778764',
    issueDate: '29/05/2026',
    expiryDate: 'Active',
    pdfUrl: '/udyam-registration.pdf',
    description: 'Official Udyam Registration Certificate issued by Ministry of Micro, Small and Medium Enterprises. Major Activity: MANUFACTURING. National Industry Classification (NIC 25113: Manufacture of industrial frameworks in metal). Unit: PIPE SUPPORTS AND FIXING SYSTEMS PVT LTD.',
    category: 'Ministry of MSME',
  },
  {
    id: 'iec',
    name: 'Importer-Exporter Code (IEC)',
    title: 'Directorate General of Foreign Trade (DGFT)',
    issuingBody: 'Ministry of Commerce and Industry, Mumbai',
    certificateNumber: 'AAQCP8686C',
    issueDate: '14/06/2026',
    expiryDate: 'Active',
    pdfUrl: '/iec-certificate.pdf',
    description: 'Importer-Exporter Code issued by Office of the Additional Director General of Foreign Trade, Mumbai, Ministry of Commerce and Industry. Nature of Concern: Private Limited. Authorized Signatory: Santanu Ghosh.',
    category: 'Ministry of Commerce',
  },
  {
    id: 'gst',
    name: 'GST Registration Certificate',
    title: 'Goods and Services Tax (Form GST REG-06)',
    issuingBody: 'Government of India',
    certificateNumber: '27AAQCP8686C1ZR',
    issueDate: '26/05/2026',
    expiryDate: 'Active',
    pdfUrl: '/gst-registration.pdf',
    description: 'Form GST REG-06 [See Rule 10(1)] Registration Certificate under Goods and Services Tax Act. Constitution of Business: Private Limited Company. Principal Place of Business: C705, Bhagirathi Residency, Ganesh Nagar, Badlapur, Thane – 421503.',
    category: 'Goods and Services Tax',
  },
];
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} | UNIclamp` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | UNIclamp` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
