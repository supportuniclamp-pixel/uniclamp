import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import cloudinary from '@/lib/cloudinary';
import { getSession } from '@/lib/auth';
import { normalizeRawProduct, generateSlug, RawProductImportItem } from '@/lib/bulk-import-utils';
import JSZip from 'jszip';
import Papa from 'papaparse';

// Upload Buffer to Cloudinary
async function uploadBufferToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uniclamp/products',
        resource_type: 'auto',
        filename_override: filename,
        use_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please login as admin.' }, { status: 401 });
    }

    await dbConnect();

    // 2. Read incoming multipart/form-data or json
    const contentType = req.headers.get('content-type') || '';
    let rawItems: RawProductImportItem[] = [];
    const zipImagesMap = new Map<string, Buffer>();

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No import file provided.' }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileName.endsWith('.json')) {
        const text = buffer.toString('utf-8');
        try {
          const parsed = JSON.parse(text);
          rawItems = Array.isArray(parsed) ? parsed : parsed.products || [];
        } catch (e: any) {
          return NextResponse.json({ error: 'Invalid JSON file: ' + e.message }, { status: 400 });
        }
      } else if (fileName.endsWith('.csv')) {
        const text = buffer.toString('utf-8');
        const parsed = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim(),
        });
        // Filter out non-fatal PapaParse notices unless it completely failed
        const fatalErrors = (parsed.errors || []).filter(
          (err) => err.code !== 'TooManyFields' && err.code !== 'TooFewFields' && err.code !== 'UndetectableDelimiter'
        );
        if (fatalErrors.length > 0) {
          const firstErr = fatalErrors[0];
          return NextResponse.json({ error: `CSV parse error on row ${firstErr.row}: ${firstErr.message}` }, { status: 400 });
        }
        rawItems = parsed.data as RawProductImportItem[];
      } else if (fileName.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(buffer);
        let dataFileFound = false;

        // First pass: locate and extract images into map
        const fileNames = Object.keys(zip.files);
        for (const fName of fileNames) {
          const entry = zip.files[fName];
          if (entry.dir) continue;

          const base = fName.split('/').pop() || fName;
          const lower = base.toLowerCase();

          if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.svg')) {
            const imgBuf = await entry.async('nodebuffer');
            zipImagesMap.set(base, imgBuf);
            zipImagesMap.set(fName, imgBuf); // also store relative path
          }
        }

        // Second pass: find JSON or CSV data file inside ZIP
        for (const fName of fileNames) {
          const entry = zip.files[fName];
          if (entry.dir) continue;
          const lower = fName.toLowerCase();

          if (lower.endsWith('.json')) {
            const text = await entry.async('string');
            try {
              const parsed = JSON.parse(text);
              rawItems = Array.isArray(parsed) ? parsed : parsed.products || [];
              dataFileFound = true;
              break;
            } catch (e: any) {
              return NextResponse.json({ error: 'Error parsing JSON inside ZIP: ' + e.message }, { status: 400 });
            }
          } else if (lower.endsWith('.csv')) {
            const text = await entry.async('string');
            const parsed = Papa.parse<Record<string, string>>(text, {
              header: true,
              skipEmptyLines: true,
              transformHeader: (h) => h.trim(),
            });
            rawItems = parsed.data as RawProductImportItem[];
            dataFileFound = true;
            break;
          }
        }

        if (!dataFileFound) {
          return NextResponse.json({
            error: 'ZIP file must contain a .json or .csv data file with product records alongside your images.',
          }, { status: 400 });
        }
      } else {
        return NextResponse.json({
          error: 'Unsupported file type. Please upload a .json, .csv, or .zip archive.',
        }, { status: 400 });
      }
    } else if (contentType.includes('application/json')) {
      const body = await req.json();
      rawItems = Array.isArray(body) ? body : body.products || [];
    }

    if (!rawItems || rawItems.length === 0) {
      return NextResponse.json({ error: 'No products found to import.' }, { status: 400 });
    }

    // Cap at sensible upload limit
    if (rawItems.length > 500) {
      return NextResponse.json({ error: 'Bulk import limit exceeded. Maximum 500 products per batch.' }, { status: 400 });
    }

    // 3. Pre-fetch existing categories for matching and auto-creation if needed
    const allCategories = await Category.find({}).lean();
    const categoryMap = new Map<string, any>(); // key: lowercase normalized name/slug
    for (const cat of allCategories) {
      categoryMap.set(cat.name.toLowerCase().trim(), cat);
      categoryMap.set(cat.slug.toLowerCase().trim(), cat);
      if (cat._id) categoryMap.set(String(cat._id), cat);
    }

    // 4. Pre-fetch existing product slugs to detect duplicates
    const existingProducts = await Product.find({}, { slug: 1, name: 1 }).lean();
    const existingSlugs = new Set(existingProducts.map(p => p.slug.toLowerCase().trim()));
    const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase().trim()));

    // Keep track of slugs within this current batch
    const currentBatchSlugs = new Set<string>();

    const successfullyImported: any[] = [];
    const skippedDuplicates: Array<{ name: string; slug: string; reason: string }> = [];
    const failedRecords: Array<{ index: number; name?: string; message: string; error: string }> = [];

    // Helper to upload or resolve image URL
    async function resolveImageUrl(val: string): Promise<string> {
      if (!val) return '';
      const trimmed = val.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
      }
      if (trimmed.startsWith('data:image/')) {
        // base64 upload
        try {
          const res = await cloudinary.uploader.upload(trimmed, { folder: 'uniclamp/products' });
          return res.secure_url;
        } catch (e: any) {
          console.error('Base64 upload error:', e);
          return '';
        }
      }

      // Check if file is bundled in ZIP
      const filenameOnly = trimmed.split(/[\/\\]/).pop() || trimmed;
      const buf = zipImagesMap.get(trimmed) || zipImagesMap.get(filenameOnly);
      if (buf) {
        try {
          return await uploadBufferToCloudinary(buf, filenameOnly);
        } catch (err: any) {
          console.error(`Error uploading ZIP image ${filenameOnly}:`, err);
          return '';
        }
      }

      // If relative asset path already on site like /assets/products.jpg
      if (trimmed.startsWith('/')) {
        return trimmed;
      }

      return '';
    }

    const productsToInsert: any[] = [];

    // 5. Process & normalize each product item
    for (let i = 0; i < rawItems.length; i++) {
      const raw = rawItems[i];
      const { normalized, error } = normalizeRawProduct(raw, i);

      if (error || !normalized) {
        failedRecords.push({
          index: i + 1,
          name: (raw as any)?.name || (raw as any)?.['Product Name'] || `Item #${i + 1}`,
          message: error || 'Validation failed',
          error: error || 'Validation failed',
        });
        continue;
      }

      const lowerName = normalized.name.toLowerCase().trim();
      const lowerSlug = normalized.slug.toLowerCase().trim();

      // Check for duplicate in DB or current batch
      if (existingSlugs.has(lowerSlug) || existingNames.has(lowerName)) {
        skippedDuplicates.push({
          name: normalized.name,
          slug: normalized.slug,
          reason: 'A product with this name or slug already exists in database.',
        });
        continue;
      }

      if (currentBatchSlugs.has(lowerSlug)) {
        skippedDuplicates.push({
          name: normalized.name,
          slug: normalized.slug,
          reason: 'Duplicate slug encountered within the same import file.',
        });
        continue;
      }

      // Match or create category
      const catKey = normalized.categoryName.toLowerCase().trim();
      let matchedCategory = categoryMap.get(catKey);

      if (!matchedCategory) {
        // Auto-create category so valid products are not rejected
        try {
          const newCat = await Category.create({
            name: normalized.categoryName,
            slug: generateSlug(normalized.categoryName) || `cat-${Date.now()}-${i}`,
            description: `${normalized.categoryName} industrial solutions.`,
          });
          matchedCategory = newCat;
          categoryMap.set(catKey, newCat);
          categoryMap.set(newCat.slug.toLowerCase().trim(), newCat);
        } catch (catErr: any) {
          failedRecords.push({
            index: i + 1,
            name: normalized.name,
            message: `Category "${normalized.categoryName}" could not be matched or created: ${catErr.message}`,
            error: `Category "${normalized.categoryName}" could not be matched or created: ${catErr.message}`,
          });
          continue;
        }
      }

      // Resolve images (URL or ZIP image)
      let resolvedMainImg = '';
      if (normalized.mainImage) {
        resolvedMainImg = await resolveImageUrl(normalized.mainImage);
      }

      let resolvedSpecImg = '';
      if (normalized.specificationImage) {
        resolvedSpecImg = await resolveImageUrl(normalized.specificationImage);
      }

      currentBatchSlugs.add(lowerSlug);

      productsToInsert.push({
        name: normalized.name,
        slug: normalized.slug,
        category: matchedCategory._id,
        shortDescription: normalized.shortDescription || normalized.description.slice(0, 180),
        description: normalized.description || normalized.shortDescription,
        images: resolvedMainImg ? [resolvedMainImg] : [],
        specificationImage: resolvedSpecImg || undefined,
        specifications: normalized.specifications,
        isActive: normalized.isActive,
      });
    }

    // 6. Bulk Insert
    if (productsToInsert.length > 0) {
      const inserted = await Product.insertMany(productsToInsert, { ordered: false });
      successfullyImported.push(...inserted);
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalRecords: rawItems.length,
        importedCount: successfullyImported.length,
        skippedCount: skippedDuplicates.length,
        failedCount: failedRecords.length,
      },
      imported: successfullyImported.map(p => ({ id: p._id, name: p.name, slug: p.slug })),
      skipped: skippedDuplicates,
      errors: failedRecords,
    });
  } catch (error: any) {
    console.error('Bulk product import error:', error);
    return NextResponse.json({ error: error.message || 'Bulk product import failed.' }, { status: 500 });
  }
}
