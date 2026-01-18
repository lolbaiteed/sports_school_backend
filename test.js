const bcrypt = require("bcrypt");
const crypto = require("crypto");


(async () => {

  const passwd = "admin";
  const hash = await bcrypt.hash(passwd, 12);

  const secret_enc = crypto.randomBytes(32).toString('hex');

  return console.log(hash, secret_enc);



})();

