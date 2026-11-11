const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function createMotorSvg(brand, model, color, typeBadge, accentColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="0.7" stroke-opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Studio Background -->
  <rect width="600" height="400" fill="url(#bgGrad)" />
  <rect width="600" height="400" fill="url(#grid)" />
  
  <!-- Studio Spot Glow -->
  <circle cx="300" cy="220" r="180" fill="url(#glowGrad)" filter="blur(30px)" />
  
  <!-- Ground Reflection Surface -->
  <ellipse cx="300" cy="330" rx="230" ry="25" fill="#020617" opacity="0.8" />
  <ellipse cx="300" cy="330" rx="180" ry="12" fill="${accentColor}" opacity="0.25" filter="blur(10px)" />

  <!-- Motorcycle Silhouette Graphic -->
  <g transform="translate(110, 110)">
    <!-- Rear Wheel -->
    <circle cx="80" cy="180" r="48" fill="#1e293b" stroke="#475569" stroke-width="8"/>
    <circle cx="80" cy="180" r="30" fill="#0f172a" stroke="${accentColor}" stroke-width="3"/>
    <circle cx="80" cy="180" r="10" fill="#64748b"/>
    
    <!-- Front Wheel -->
    <circle cx="310" cy="180" r="48" fill="#1e293b" stroke="#475569" stroke-width="8"/>
    <circle cx="310" cy="180" r="30" fill="#0f172a" stroke="${accentColor}" stroke-width="3"/>
    <circle cx="310" cy="180" r="10" fill="#64748b"/>

    <!-- Exhaust & Engine Block -->
    <path d="M120 185 L180 185 L200 160 L140 160 Z" fill="#334155" />
    <path d="M150 180 L220 180 L205 140 L160 140 Z" fill="#475569" />
    <!-- Exhaust pipe -->
    <path d="M170 175 L80 165" stroke="#94a3b8" stroke-width="7" stroke-linecap="round"/>

    <!-- Frame & Bodywork -->
    <path d="M110 160 L180 120 L230 110 L270 130 L220 165 Z" fill="${color}" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3"/>
    <path d="M180 120 L150 100 L110 105 L125 125 Z" fill="${color}" />
    <!-- Gas Tank -->
    <path d="M180 115 C210 90, 240 95, 260 120 L230 135 Z" fill="${accentColor}" />
    <!-- Front Fork & Handlebars -->
    <line x1="310" y1="180" x2="270" y2="85" stroke="#cbd5e1" stroke-width="8" stroke-linecap="round"/>
    <path d="M260 85 L285 85 L295 92" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
    <!-- Headlight -->
    <polygon points="285,100 300,105 285,115" fill="#38bdf8" />
    <!-- Seat -->
    <path d="M130 105 C150 100, 175 105, 190 120 L145 125 Z" fill="#090d16" />
  </g>

  <!-- Brand & Specs Overlay Badges -->
  <g transform="translate(30, 40)">
    <rect x="0" y="0" width="130" height="28" rx="14" fill="#0f172a" fill-opacity="0.85" stroke="#334155" stroke-width="1" />
    <circle cx="16" cy="14" r="5" fill="${accentColor}" />
    <text x="28" y="18" font-family="'Outfit', sans-serif" font-weight="700" font-size="12" fill="#f8fafc">${brand.toUpperCase()}</text>
  </g>

  <g transform="translate(450, 40)">
    <rect x="0" y="0" width="120" height="28" rx="14" fill="#2563eb" fill-opacity="0.9" />
    <text x="60" y="18" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">${typeBadge}</text>
  </g>

  <!-- Bottom Title Overlay -->
  <rect x="0" y="325" width="600" height="75" fill="#090d16" fill-opacity="0.85" />
  <line x1="0" y1="325" x2="600" y2="325" stroke="#334155" stroke-width="1" />
  
  <text x="30" y="355" font-family="'Outfit', sans-serif" font-weight="700" font-size="20" fill="#ffffff">${model}</text>
  <text x="30" y="380" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="13" fill="#94a3b8">MOKAS Verified 360° • Garansi Siap Pakai</text>
  
  <g transform="translate(480, 345)">
    <rect x="0" y="0" width="90" height="32" rx="8" fill="#006242" />
    <text x="45" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">BERKUALITAS</text>
  </g>
</svg>`;
}

function createNewsSvg(title, category, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
  <defs>
    <linearGradient id="newsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="600" height="360" fill="url(#newsGrad)" />
  
  <!-- Accent Glow -->
  <circle cx="500" cy="100" r="140" fill="${color}" opacity="0.15" filter="blur(30px)" />
  
  <!-- Category Badge -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="150" height="30" rx="15" fill="${color}" />
    <text x="75" y="19" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">${category}</text>
  </g>

  <!-- Graphic Icon Illustration -->
  <g transform="translate(250, 100)" opacity="0.3">
    <circle cx="50" cy="50" r="70" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="8 6"/>
    <path d="M25 50 L45 70 L80 30" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Article Headline Preview -->
  <g transform="translate(40, 160)">
    <text x="0" y="30" font-family="'Outfit', sans-serif" font-weight="700" font-size="24" fill="#ffffff" width="520">
      ${title}
    </text>
    <line x1="0" y1="90" x2="520" y2="90" stroke="#334155" stroke-width="1"/>
    <text x="0" y="125" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="13" fill="#38bdf8">MOKAS Otomotif & Legalitas Guide • 2026</text>
  </g>
</svg>`;
}

const bikes = [
  { file: 'motor-mt07.svg', brand: 'Yamaha', model: 'Yamaha MT-07 ABS', color: '#0284c7', badge: 'Sport 689cc', accent: '#38bdf8' },
  { file: 'motor-cbr250.svg', brand: 'Honda', model: 'Honda CBR 250RR SP', color: '#dc2626', badge: 'Racing 250cc', accent: '#ef4444' },
  { file: 'motor-vespa.svg', brand: 'Vespa', model: 'Vespa Sprint S 150', color: '#475569', badge: 'Matic 155cc', accent: '#f59e0b' },
  { file: 'motor-nmax.svg', brand: 'Yamaha', model: 'Yamaha NMAX 155 ABS', color: '#047857', badge: 'Maxi Scooter', accent: '#10b981' },
  { file: 'motor-pcx.svg', brand: 'Honda', model: 'Honda PCX 160 CBS', color: '#64748b', badge: 'Matic Premium', accent: '#06b6d4' },
  { file: 'motor-klx.svg', brand: 'Kawasaki', model: 'Kawasaki KLX 150 BF', color: '#16a34a', badge: 'Trail Adventure', accent: '#22c55e' }
];

bikes.forEach(b => {
  const svg = createMotorSvg(b.brand, b.model, b.color, b.badge, b.accent);
  fs.writeFileSync(path.join(targetDir, b.file), svg, 'utf8');
});

const articles = [
  { file: 'news-cek-mesin.svg', title: '5 Cek Mesin Motor Second Bebas Masalah', category: 'PANDUAN PEMBELI', color: '#2563eb' },
  { file: 'news-cek-surat.svg', title: 'Panduan Keabsahan STNK & BPKB Asli', category: 'LEGALITAS SAMSAT', color: '#006242' },
  { file: 'news-matic-irit.svg', title: 'Rekomendasi Matic Second Paling Irit 2026', category: 'REKOMENDASI UNIT', color: '#d97706' }
];

articles.forEach(a => {
  const svg = createNewsSvg(a.title, a.category, a.color);
  fs.writeFileSync(path.join(targetDir, a.file), svg, 'utf8');
});

console.log('Successfully generated all placeholder SVGs in public/images');

