sed -i 's/.select('\''id, host_id, title, status, thumbnail, category, is_vip, entry_fee, created_at, profiles:host_id(id, username, name, avatar)'\'')/.select('\''id, host_id, title, status, thumbnail, category, is_vip, entry_fee, created_at, last_heartbeat_at, started_at, profiles:host_id(id, username, name, avatar)'\'')/g' src/services/api.js

sed -i 's/.eq('\''status'\'', '\''active'\'').gte('\''created_at'\'', new Date(Date.now() - 4 \* 60 \* 60 \* 1000).toISOString())/.eq('\''status'\'', '\''active'\'')/g' src/services/api.js
