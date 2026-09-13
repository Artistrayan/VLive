sed -i 's/.eq('\''status'\'', '\''active'\'')/.eq('\''status'\'', '\''active'\'').gte('\''created_at'\'', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())/g' src/services/api.js
