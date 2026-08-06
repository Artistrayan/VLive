const https = require('https');

function translate(text, sl='fa', tl='en') {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json[0].map(item => item[0]).join(''));
        } catch (e) {
          resolve(text); // fallback
        }
      });
    }).on('error', reject);
  });
}

translate('سلام دنیا! این یک تست است.').then(console.log);
