import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'https'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'google-reviews-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/reviews', (_req, res) => {
            const apiKey = env.GOOGLE_PLACES_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY is not defined' }));
              return;
            }
            const placeId = env.GOOGLE_PLACE_ID || 'ChIJAQAM01pD54YROPEQr-ZAuEA';
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

            https.get(url, (apiRes) => {
              let data = '';
              apiRes.on('data', (chunk) => { data += chunk; });
              apiRes.on('end', () => {
                try {
                  const json = JSON.parse(data);
                  res.statusCode = json.status === 'OK' ? 200 : 500;
                  res.setHeader('Content-Type', 'application/json');
                  if (json.status === 'OK') {
                    res.end(JSON.stringify(json.result));
                  } else {
                    res.end(JSON.stringify({ error: json.error_message || json.status }));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'JSON parse error' }));
                }
              });
            }).on('error', (err) => {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            });
          });
        }
      }
    ]
  };
})

