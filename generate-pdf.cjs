const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50, size: 'A4' });

doc.pipe(fs.createWriteStream('public/UNIclamp_Catalog.pdf'));

// Colors
const primaryColor = '#0f4c3a'; // dark green
const accentColor = '#f5c64f'; // yellow/gold
const textColor = '#333333';

// Helper function to draw a section
function drawCategory(title, items) {
  doc.moveDown(1.5);
  doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text(title);
  doc.moveDown(0.5);
  
  doc.fillColor(textColor).fontSize(10).font('Helvetica');
  items.forEach(item => {
    doc.rect(doc.x, doc.y, 495, 20).fill('#f9f9f9');
    doc.fillColor(textColor).text(item, doc.x + 10, doc.y + 5);
    doc.moveDown(1);
  });
}

// 1. Title Page
doc.rect(0, 0, 595, 842).fill(primaryColor);
doc.fillColor(accentColor).fontSize(48).font('Helvetica-Bold').text('UNIclamp', 50, 200, { align: 'center' });
doc.fillColor('#ffffff').fontSize(24).font('Helvetica').text('PRODUCT OVERVIEW', 50, 260, { align: 'center' });
doc.fontSize(12).text('PIPE SUPPORTS & FIXING SYSTEMS', 50, 300, { align: 'center', characterSpacing: 2 });
doc.text('uniclamp.com', 50, 750, { align: 'center' });
doc.addPage();

// 2. Company Profile
doc.fillColor(primaryColor).fontSize(28).font('Helvetica-Bold').text('Company Profile', 50, 50);
doc.moveDown(1);
doc.fillColor(textColor).fontSize(11).font('Helvetica').lineGap(4);
doc.text('UNIclamp is a leading manufacturer of premium pipe supports and fixing systems. With a commitment to engineering excellence and precision manufacturing, we deliver reliable solutions for complex industrial, commercial, and infrastructure projects.');
doc.moveDown(1);
doc.text('Our organization is ISO 9001:2015 certified, continuously improving our operational processes to ensure the highest quality standards. Our products are rigorously tested and approved by international testing institutes.');
doc.moveDown(2);

// 3. Table of Contents
doc.fillColor(primaryColor).fontSize(20).font('Helvetica-Bold').text('Table of Contents');
doc.moveDown(1);
const toc = [
  'A. Metal pipe clamps with Lining',
  'B. Metal pipe clamps',
  'C. Insulation Protection',
  'D. Fix point and Sliding Devices',
  'E. RapidStrut Fixing System',
  'F. Roof Support System',
  'G. Maxx Support System',
  'H. Seismic Cable support system',
  'I. Heavy Duty Anchors',
  'J. Fixing Accessories',
  'K. Fire Protection System'
];
doc.fillColor(textColor).fontSize(12).font('Helvetica');
toc.forEach(item => {
  doc.text(item);
  doc.moveDown(0.5);
});
doc.addPage();

// 4. Products A-D
doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold').text('Product Categories', 50, 50);
drawCategory('A. Metal Pipe Clamps with Lining', ['Lined Split Clamp', 'Heavy Duty Lined Clamp', 'Lined Two Bolt Clamp', 'Lined Riser Clamp', 'Lined U Strap Clamp', 'Lined HD Sprinkler Clamp', 'Lined Clevis Hanger']);
drawCategory('B. Metal Pipe Clamps', ['Plain Split Clamp', 'Heavy Duty Clamp', 'Two Bolt Clamp', 'Riser Clamp', 'U Strap Clamp', 'U Bolt Clamp', 'Heavy Duty Sprinkler Clamp', 'Standard Clevis Hanger', 'Pipe Roller Hanger']);
drawCategory('C. Insulation Protection', ['Rubber Support Insert', 'Water Repellent Calcium Silicate', 'PIR Pipe Support Insert', 'Insulation Protection Shield']);
drawCategory('D. Fix Point and Sliding Devices', ['dB-Fix Point Assembly', 'Fix Point Console Medium', 'Fix Point Console Heavy', 'Threaded Rod Support', 'Adjustable Support', 'Expansion Device', 'Expansion Guide Assembly']);
doc.addPage();

// 5. Products E-H
drawCategory('E. RapidStrut Fixing System', ['RapidRail Channel', 'RapidStrut Channel DS5', 'RapidStrut Double Channel', 'RapidRail Cantilever Arms', 'RapidStrut Cantilever Arms', 'BIS Strut Base plate', 'Strut Base plate (Hinged)', 'Strut Connectors (90°, 45°, 30°)', 'Strut Slide Nut', 'Strut Beam Clamps']);
drawCategory('F. Roof Support System', ['Yeti® 130', 'Yeti® 280', 'Yeti® 335', 'Yeti® 480', 'Ursus®', 'Fastening Set for Grids', 'Yeti® Service Deck Grid', 'Yeti® Service Deck Step']);
drawCategory('G. Maxx Rail Fixing System', ['Maxx Heavy Rail Profile', 'Maxx Base Plate', 'Maxx Cross Connector', 'Maxx Linear Connector Set', 'Maxx U-Shape Bracket', 'Maxx End Caps', 'Maxx Bolt Set', 'Maxx Beam Clamp']);
drawCategory('H. Seismic Cable Support System', ['UL Listed Seismic Cables', 'UL Listed Crimping Sleeves', 'UL Listed Standard Brackets', 'UL Listed Retrofit Brackets', 'Threaded Rod Stiffener', 'Cable Cutter', 'Hand Swagger Tool']);
doc.addPage();

// 6. Products I-K & Technical Services
drawCategory('I. Heavy Duty Anchors', ['Concrete Screws W-LX-N', 'Concrete Screws W-LX-H', 'WT1 Throughbolt Anchors', 'WT7 Throughbolt Anchors', 'WHA1 Highload Anchors', 'WSA1 Shield Anchors', 'WCA1 Ceiling Anchors', 'WDI2L Drop-In Anchors', 'Chemical Anchors WPSF100', 'WIS Threaded Rods']);
drawCategory('J. Fixing Accessories', ['Wall Plates', 'Hexagonal Nut', 'Self Lock Nut', 'Hexagonal Head Bolt', 'Threaded Rods', 'Hexagonal Coupling Nut', 'Flat Washers', 'Draw-In Anchors']);
drawCategory('K. Fire Protection System', ['Fire Sleeve', 'EFC Fire Collar', 'AWM III Fire Collar', 'IWM III Fire Strip', 'Silicone Fire Sealant', 'Acrylic Fire Sealant']);

doc.moveDown(2);
doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Technical Services - from Engineering to Site Support');
doc.moveDown(0.5);
doc.fillColor(textColor).fontSize(10).font('Helvetica').lineGap(3);
doc.text('• Design: We develop intelligent support designs using CAD software and validate them through advanced analysis tools.\n• BIM Support: Our products are available in BIM to help designers plan confidently and minimize errors.\n• Pre-Fabrication: Pre-assembled elements manufactured offsite for faster and safer on-site installation.\n• On-Site Support: Hands-on training for proper system application and conducting pull-out tests.');

// Finalize PDF file
doc.end();
console.log('PDF Catalog successfully generated at public/UNIclamp_Catalog.pdf');
