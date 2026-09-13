sed -i -e '/host_id: hostUuid,/!b' -e 'n' -e 'n' -e "s/status: 'active'/status: streamPayload.status || 'starting'/g" src/services/api.js
