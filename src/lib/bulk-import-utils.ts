export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters except hyphen & spaces
    .replace(/[\s_-]+/g, '-') // collapse whitespace and replace with -
    .replace(/^-+|-+$/g, ''); // trim leading/trailing -
}

export interface RawProductImportItem {
  name?: string;
  productName?: string;
  slug?: string;
  category?: string;
  categoryName?: string;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  image?: string;
  mainImage?: string;
  images?: string[] | string;
  specificationImage?: string;
  specificationsImage?: string;
  specifications?: Array<{ key: string; value: string }> | Record<string, string> | string;
  isActive?: boolean | string | number;
  active?: boolean | string | number;
}

export interface NormalizedProductItem {
  name: string;
  slug: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  specificationImage: string;
  specifications: Array<{ key: string; value: string }>;
  isActive: boolean;
}

export function normalizeSpecifications(raw: any): Array<{ key: string; value: string }> {
  if (!raw) return [];
  
  // If already array of { key, value }
  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (!item) return null;
        if (typeof item === 'object' && ('key' in item || 'value' in item)) {
          const k = String(item.key || item.name || '').trim();
          const v = String(item.value || '').trim();
          return k ? { key: k, value: v } : null;
        }
        if (typeof item === 'string') {
          const parts = item.split(':');
          const k = parts[0]?.trim();
          const v = parts.slice(1).join(':').trim();
          return k ? { key: k, value: v } : null;
        }
        return null;
      })
      .filter((s): s is { key: string; value: string } => Boolean(s));
  }

  // If object { key: value }
  if (typeof raw === 'object') {
    return Object.entries(raw)
      .map(([k, v]) => ({ key: k.trim(), value: String(v ?? '').trim() }))
      .filter(s => s.key.length > 0);
  }

  // If string (e.g., CSV serialized: "Type: Isolator | Sizes: 50kg | Finish: Painted" or JSON string)
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeSpecifications(parsed);
      } catch {
        // fallback to delimiter parsing
      }
    }
    // Delimited by pipe (|) or semicolon (;) or newline (\n)
    const delimiters = ['|', ';', '\n'];
    let chosenDelim = '|';
    for (const d of delimiters) {
      if (trimmed.includes(d)) {
        chosenDelim = d;
        break;
      }
    }
    return trimmed
      .split(chosenDelim)
      .map(pair => {
        const idx = pair.indexOf(':');
        if (idx === -1) return null;
        const k = pair.slice(0, idx).trim();
        const v = pair.slice(idx + 1).trim();
        return k ? { key: k, value: v } : null;
      })
      .filter((s): s is { key: string; value: string } => Boolean(s));
  }

  return [];
}

export function normalizeRawProduct(raw: RawProductImportItem, index: number): {
  normalized?: NormalizedProductItem;
  error?: string;
} {
  // Normalize key lookup so headers like "Product Name", "product_name", "productName" all match
  const rawObj: Record<string, any> = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (k) {
      const cleanKey = k.toLowerCase().replace(/[\s_\/-]+/g, '');
      rawObj[cleanKey] = v;
    }
  }

  const getField = (...candidates: string[]) => {
    for (const c of candidates) {
      const clean = c.toLowerCase().replace(/[\s_\/-]+/g, '');
      if (rawObj[clean] !== undefined && rawObj[clean] !== null && String(rawObj[clean]).trim() !== '') {
        return rawObj[clean];
      }
    }
    return '';
  };

  const name = String(getField('Product Name', 'name', 'productName', 'title') || '').trim();
  if (!name) {
    return { error: `Row ${index + 1}: "Product Name" is required.` };
  }

  const categoryName = String(getField('Category', 'categoryName', 'category_name') || '').trim();
  if (!categoryName) {
    return { error: `Row ${index + 1} ("${name}"): "Category" is required.` };
  }

  let slug = String(getField('Slug', 'slug') || '').trim();
  if (!slug) {
    slug = generateSlug(name);
  } else {
    slug = generateSlug(slug);
  }
  if (!slug) {
    slug = `product-${Date.now()}-${index + 1}`;
  }

  const shortDescription = String(getField('Short Description', 'shortDescription', 'short_description') || '').trim();
  const description = String(getField('Full Description', 'description', 'fullDescription', 'full_description') || '').trim();

  // Main Image extraction
  let mainImage = String(
    getField('Product Main Image', 'mainImage', 'image', 'main_image', 'images') || ''
  ).trim();

  // Specification image extraction
  const specificationImage = String(
    getField(
      'Specifications / Packaging Diagram Image',
      'specificationImage',
      'specificationsImage',
      'specification_image',
      'packagingImage',
      'diagramImage'
    ) || ''
  ).trim();

  // Specifications
  const rawSpecs = getField('Key Specifications', 'specifications', 'specs', 'key_specifications');
  const specifications = normalizeSpecifications(rawSpecs);

  // Active boolean
  let isActive = true;
  const rawActive = getField('Active', 'isActive', 'active', 'is_active', 'status');
  if (rawActive !== '' && rawActive !== undefined) {
    if (typeof rawActive === 'boolean') {
      isActive = rawActive;
    } else if (typeof rawActive === 'string') {
      const lower = rawActive.toLowerCase().trim();
      isActive = !(lower === 'false' || lower === '0' || lower === 'no' || lower === 'inactive');
    } else if (typeof rawActive === 'number') {
      isActive = rawActive === 1;
    }
  }

  return {
    normalized: {
      name,
      slug,
      categoryName,
      shortDescription,
      description,
      mainImage,
      specificationImage,
      specifications,
      isActive,
    },
  };
}
