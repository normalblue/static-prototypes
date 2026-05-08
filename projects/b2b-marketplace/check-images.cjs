const fs = require('fs');
const https = require('https');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.ts');
const content = fs.readFileSync(mockDataPath, 'utf8');

const regex = /image:\s*'([^']+)'/g;
let match;
const urls = new Set();
while ((match = regex.exec(content)) !== null) {
  urls.add(match[1]);
}

console.log(`Found ${urls.size} unique URLs. Checking...`);

let pending = urls.size;
const broken = [];

Array.from(urls).forEach(url => {
  https.request(url, { method: 'HEAD' }, (res) => {
    if (res.statusCode >= 400) {
      console.log(`BROKEN [${res.statusCode}]: ${url}`);
      broken.push(url);
    }
    pending--;
    if (pending === 0) console.log(`Done. Found ${broken.length} broken links.`);
  }).on('error', (err) => {
    console.log(`ERROR: ${url} - ${err.message}`);
    broken.push(url);
    pending--;
    if (pending === 0) console.log(`Done. Found ${broken.length} broken links.`);
  }).end();
});
