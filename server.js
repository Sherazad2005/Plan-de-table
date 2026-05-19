const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  // Route racine → index.html
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file    = path.join(__dirname, urlPath);
  const ext     = path.extname(file).toLowerCase();
  const ct      = MIME[ext] || 'application/octet-stream';

  fs.readFile(file, (err, data) => {
    if (err) {
      // Fallback → index.html pour toute route inconnue
      fs.readFile(path.join(__dirname, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(500); res.end('Erreur serveur'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
