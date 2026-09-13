const fs = require('fs');
let content = fs.readFileSync('src/services/api.js', 'utf8');

const insertBlockOld = `      .insert([{
        host_id: hostUuid,
        title: title,
        status: streamPayload.status || 'starting',
        category: category,
        thumbnail: thumbnail,
        is_vip: isVip,
        entry_fee: entryFee
      }])`;

const insertBlockNew = `      .insert([{
        host_id: hostUuid,
        title: title,
        status: streamPayload.status || 'starting',
        category: category,
        thumbnail: thumbnail,
        is_vip: isVip,
        entry_fee: entryFee,
        started_at: new Date().toISOString(),
        last_heartbeat_at: new Date().toISOString()
      }])`;

if (content.includes(insertBlockOld)) {
    content = content.replace(insertBlockOld, insertBlockNew);
    fs.writeFileSync('src/services/api.js', content);
    console.log("api.js patched successfully.");
} else {
    console.log("Could not find block in api.js to patch.");
}
