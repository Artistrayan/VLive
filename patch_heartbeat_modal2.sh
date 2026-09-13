sed -i '/apiLive.sendHeartbeat/d' src/components/LiveStudioModal.jsx
sed -i '/setLiveDurationSeconds(prev => prev + 1);/a \
        setLiveDurationSeconds(prev => {\
          if (prev % 15 === 0 && activeStreamRecord?.id) {\
            apiLive.sendHeartbeat(activeStreamRecord.id);\
          }\
          return prev + 1;\
        });\
' src/components/LiveStudioModal.jsx
sed -i '/setLiveDurationSeconds(prev => prev + 1);/d' src/components/LiveStudioModal.jsx
