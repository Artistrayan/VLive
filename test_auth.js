const initData = "";
let tgUser = null;
if (typeof initData === 'string' && initData) {
    // skipped
}
const tgId = tgUser?.id || Date.now();
console.log("Generated tgId:", tgId);
