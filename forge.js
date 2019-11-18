const Metalsmith = require('metalsmith');
const markdown   = require('metalsmith-markdown');
const layouts    = require('metalsmith-layouts');
const discoverPartials = require('metalsmith-discover-partials');



module.exports=function(){
  return Metalsmith(__dirname)
      .source('./src')         // source directory for the pipeline
      .use(discoverPartials())  // <-- find and register template partials
      .use(markdown())         // <-- convert Markdown to HTML
      .use(layouts({           // <-- process all HTML files with Handlebars
          default: 'page.hbs',
          engine: 'handlebars'
      }))
      .destination('./build')  // destination directory of the pipeline
      .clean(true)             // clean the destination directory before build

}
