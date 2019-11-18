const forge = require("./forge.js")
const watch = require('metalsmith-watch');


forge()
  .use(
    watch({
        paths: {
          "${source}/**/*": true,
          "templates/**/*": "**/*.md",
        },
        livereload: true,
      })
    )
  .build(function (err) {  // execute the build
    if (err) {
      throw err;
    }
  });
