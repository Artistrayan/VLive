sed -i 's/this._handleViewerJoin(payload.viewerId);/\/\/ this._handleViewerJoin(payload.viewerId);/g' src/services/liveStreamRoomService.js
sed -i 's/this._handleWebRtcOffer(payload);/\/\/ this._handleWebRtcOffer(payload);/g' src/services/liveStreamRoomService.js
sed -i 's/this._handleWebRtcAnswer(payload);/\/\/ this._handleWebRtcAnswer(payload);/g' src/services/liveStreamRoomService.js
sed -i 's/this._handleIceCandidate(payload);/\/\/ this._handleIceCandidate(payload);/g' src/services/liveStreamRoomService.js
