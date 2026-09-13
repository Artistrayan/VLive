sed -i "s/status: 'active'/status: streamPayload.status || 'active'/g" src/services/api.js
