const fs = require('fs');
const https = require('https');

const urls = [
    'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/ScrollMagic.min.js',
    'https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js',
    'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js',
    'https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.min.js'
];

const fetchAndCombine = (urls, outputPath) => {
    const promises = urls.map(url => new Promise((resolve, reject) => {
        https.get(url, response => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
            response.on('error', err => reject(err));
        });
    }));

    Promise.all(promises).then(scripts => {
        const combined = scripts.join('\n');
        fs.writeFile(outputPath, combined, err => {
            if (err) throw err;
            console.log('Combined script saved!');
        });
    }).catch(err => console.error(err));
};

fetchAndCombine(urls, 'combined-scripts.js');
