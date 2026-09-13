sed -i '/async activateLiveStream/i \
  async sendHeartbeat(streamId) {\
    if (!streamId) return;\
    try {\
      await supabase.from("streams").update({ last_heartbeat_at: new Date().toISOString() }).eq("id", streamId).eq("status", "active");\
    } catch (e) {}\
  },\
' src/services/api.js
