sed -i '/async endLiveStream/i \
  async activateLiveStream(streamId) {\
    if (!streamId) return { success: false };\
    try {\
      await supabase.from("streams").update({ status: "active", started_at: new Date().toISOString() }).eq("id", streamId);\
      return { success: true };\
    } catch (e) {\
      return { success: false };\
    }\
  },\
' src/services/api.js
