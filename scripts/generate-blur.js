/**
 * Blur Data URL Generator Script
 * 
 * Generates tiny blurred base64 preview images for all images in public/nfts/
 * Output: public/nfts/blur-map.json
 * 
 * Usage: node scripts/generate-blur.js
 * 
 * Run this after adding new images to auto-generate blur placeholders
 */

const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const IMAGES_DIR = path.join(process.cwd(), 'public', 'nfts');
const OUTPUT_JSON = path.join(IMAGES_DIR, 'blur-map.json');
const BLUR_SIZE = 10; // 10x10 px tiny preview
const JPEG_QUALITY = 40; // Low quality for small base64 size

/**
 * Generate a blurred base64 data URI for an image
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} - Base64 data URI
 */
async function makeBlurDataURI(filePath) {
  try {
    const buffer = await sharp(filePath)
      .resize(BLUR_SIZE, BLUR_SIZE, { fit: 'cover' })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();
    
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main execution function
 */
async function run() {
  console.log('🔍 Scanning for images...');
  console.log(`📁 Images directory: ${IMAGES_DIR}`);
  
  // Ensure the images directory exists
  await fs.ensureDir(IMAGES_DIR);
  
  // Find all image files
  const files = glob.sync(`${IMAGES_DIR}/**/*.{png,jpg,jpeg,webp,gif}`, { 
    nodir: true,
    ignore: '**/blur-map.json'
  });
  
  if (files.length === 0) {
    console.log('⚠️  No images found in', IMAGES_DIR);
    console.log('💡 Add images to public/nfts/ and run again');
    return;
  }
  
  console.log(`📸 Found ${files.length} images`);
  console.log('🎨 Generating blur placeholders...\n');
  
  const mapping = {};
  let processed = 0;
  let failed = 0;
  
  for (const filePath of files) {
    // Use relative path from IMAGES_DIR as key
    const key = path.relative(IMAGES_DIR, filePath).replace(/\\/g, '/');
    
    const uri = await makeBlurDataURI(filePath);
    
    if (uri) {
      mapping[key] = uri;
      processed++;
      console.log(`✅ [${processed}/${files.length}] ${key}`);
    } else {
      failed++;
      console.log(`❌ [${processed + failed}/${files.length}] ${key} (failed)`);
    }
  }
  
  // Save the mapping to JSON
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(mapping, null, 2), 'utf8');
  
  console.log('\n' + '='.repeat(60));
  console.log(`✨ Success! Generated ${processed} blur placeholders`);
  if (failed > 0) {
    console.log(`⚠️  Failed to process ${failed} images`);
  }
  console.log(`💾 Saved to: ${OUTPUT_JSON}`);
  console.log('='.repeat(60));
  
  // Show usage example
  console.log('\n📖 Usage in your code:');
  console.log(`
import blurMap from '@/public/nfts/blur-map.json';

const token = {
  id: '1',
  name: 'My NFT',
  image: '/nfts/example.jpg',
  blurDataURL: blurMap['example.jpg'], // <- Auto-generated blur
  // ... other properties
};
  `);
}

// Handle errors
run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
