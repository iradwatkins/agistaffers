#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// SVG icon template with AGI Staffers branding
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#8b5cf6" rx="64"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="180" font-weight="bold" text-anchor="middle" fill="white">AGI</text>
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="white">STAFFERS</text>
</svg>`;

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Save the base SVG
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
console.log('✅ Created icon.svg');

// For now, we'll create placeholder PNG files
// In production, you'd use a library like sharp or canvas to generate actual PNGs
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // Check if file already exists
  if (!fs.existsSync(filepath)) {
    // Create a simple placeholder (in production, use proper image generation)
    // For now, copy existing icons or create empty files
    if (fs.existsSync(path.join(iconsDir, 'icon-192x192.png')) && size <= 192) {
      fs.copyFileSync(path.join(iconsDir, 'icon-192x192.png'), filepath);
    } else if (fs.existsSync(path.join(iconsDir, 'icon-512x512.png'))) {
      fs.copyFileSync(path.join(iconsDir, 'icon-512x512.png'), filepath);
    }
    console.log(`✅ Created ${filename}`);
  } else {
    console.log(`⏭️  ${filename} already exists`);
  }
});

// Create apple-touch-icon
const appleTouchIcon = path.join(iconsDir, '..', 'apple-touch-icon.png');
if (!fs.existsSync(appleTouchIcon) && fs.existsSync(path.join(iconsDir, 'icon-192x192.png'))) {
  fs.copyFileSync(path.join(iconsDir, 'icon-192x192.png'), appleTouchIcon);
  console.log('✅ Created apple-touch-icon.png');
}

// Create favicon.ico (copy from existing icon)
const favicon = path.join(iconsDir, '..', 'favicon.ico');
if (!fs.existsSync(favicon) && fs.existsSync(path.join(iconsDir, 'icon-192x192.png'))) {
  // In production, you'd convert to .ico format
  // For now, we'll just note it needs to be created
  console.log('⚠️  favicon.ico needs to be created from icon');
}

console.log('\n✨ PWA icons setup complete!');
console.log('Note: For production, use proper image generation tools to create actual PNG files from the SVG.');