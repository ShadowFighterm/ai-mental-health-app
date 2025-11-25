const fs = require('fs');

exports.saveBase64Audio = (base64) => {
  const buffer = Buffer.from(base64, 'base64');
  const path = `./temp/${Date.now()}.wav`;
  fs.writeFileSync(path, buffer);
  return path;
};
