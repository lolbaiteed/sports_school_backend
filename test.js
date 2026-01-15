const bcrypt = require("bcrypt");


(async () => {

  const passwd = "test1337";
  const hash = await bcrypt.hash(passwd, 12);

  return console.log(hash);

})();

