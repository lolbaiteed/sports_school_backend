const bcrypt = require("bcrypt");


(async () => {

  const passwd = "admin";
  const hash = await bcrypt.hash(passwd, 12);

  return console.log(hash);

})();

