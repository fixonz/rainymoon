import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOUNDS_DIR = path.join(__dirname, '../public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

const sounds = [
  {
    name: 'gentle-rain.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'forest-rain.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'forest-birds.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'ocean-rain.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'ocean-waves.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'tropical-rain.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'jungle-ambient.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'night-rain.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  },
  {
    name: 'crickets.mp3',
    url: 'https://cdn.freesound.org/previews/411/411409_5121236-lq.mp3'
  }
];

function downloadSound(sound) {
  const filePath = path.join(SOUNDS_DIR, sound.name);
  
  if (fs.existsSync(filePath)) {
    console.log(`Sound already exists: ${sound.name}`);
    return;
  }

  const file = fs.createWriteStream(filePath);
  
  https.get(sound.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${sound.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${sound.name}:`, err.message);
  });
}

console.log('Starting sound downloads...');
sounds.forEach(downloadSound); 