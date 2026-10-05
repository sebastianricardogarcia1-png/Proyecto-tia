import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '..', 'public', 'hero');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  {
    name: 'hero-1.jpg',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'hero-2.jpg',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'hero-3.jpg',
    url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'hero-4.jpg',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'hero-5.jpg',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'hero-6.jpg',
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2000&q=85'
  }
];

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const dest = path.join(targetDir, item.name);
    console.log(`Downloading ${item.name}...`);
    try {
      await downloadImage(item.url, dest);
      console.log(`✓ Saved ${item.name}`);
    } catch (e) {
      console.error(`✕ Error on ${item.name}:`, e.message);
    }
  }
  console.log('All hero images ready!');
}

run();
