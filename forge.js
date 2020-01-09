const Metalsmith = require('metalsmith');
const markdown   = require('metalsmith-markdown');
const layouts    = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks')
const discoverPartials = require('metalsmith-discover-partials');


function debug() {
  return function(files, m, done) {
    console.log(files)
    done()
  }
}

module.exports=function(){
  return Metalsmith(__dirname)
      .source('./projects')         // source directory for the pipeline
      .use(collections({
        projects: '*.md'
      }))
      .use(permalinks({
        pattern: '*.md',
        linksets: [
          {
            match: {
              collection: 'projects'
            },
            pattern: 'projects/:slug'
          }
        ]
      }))
      .use(discoverPartials())  // <-- find and register template partials
      .use(markdown())         // <-- convert Markdown to HTML
      .use(debug())
      .use(layouts({           // <-- process all HTML files with Handlebars
          default: 'project.hbs',
          engine: 'handlebars',
          pattern: ['*', '!index.html']
      }))
      .destination('./build')  // destination directory of the pipeline
      .clean(true)             // clean the destination directory before build

}
