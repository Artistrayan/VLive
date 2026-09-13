sed -i '/setLiveDurationSeconds(prev => prev + 1);/a \
        if (activeStreamRecord?.id) {\
          apiLive.sendHeartbeat(activeStreamRecord.id);\
        }\
' src/components/LiveStudioModal.jsx
