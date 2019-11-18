const forge = require("./forge.js")

forge().build(function (err) {  // execute the build
  if (err) {
      throw err;
  }
});
