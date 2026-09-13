sed -i '/if (!Array.isArray(data)) {/i \
      const now = Date.now();\
      const validData = (data || []).filter(s => {\
        const createdMs = new Date(s.created_at).getTime();\
        if (s.last_heartbeat_at) {\
          const hbMs = new Date(s.last_heartbeat_at).getTime();\
          return (now - hbMs) < 60000; // 1 min timeout\
        }\
        return (now - createdMs) < 120000; // 2 min grace without heartbeat\
      });\
' src/services/api.js
sed -i 's/return data.map(s => {/return validData.map(s => {/g' src/services/api.js
