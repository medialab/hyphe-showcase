const marked = require("marked");
const fse = require("fs-extra");
const Handlebars = require("handlebars");
const yamlFront = require("yaml-front-matter");


const forge = {
  build: function() {

    //const reg = /\.[^.]+$/;
    const listprojects = {};

    fse.removeSync("build");

    //getting the assets
    fse.copySync("assets", "build/assets");
    fse.copySync("favicon.ico", "build/favicon.ico");


    //Building the partials
    Handlebars.registerPartial("projectSmallPartial", fse.readFileSync("partials/project_small.hbs", "utf8"));
    Handlebars.registerPartial("leftBarPartial", fse.readFileSync("partials/left_bar.html", "utf8"));


    ////Building the 3 pages
    
    // Building project page
    const projectTemplate = Handlebars.compile(fse.readFileSync("templates/project.hbs", "utf8"));


    fse.readdirSync("projects").forEach(project => {
      //var projectname = project.split(reg)[0];
      const projectData = yamlFront.loadFront(fse.readFileSync("projects/" + project + "/description.md", "utf8"));

      projectData.slug = project;

      projectData.__content = marked(projectData["__content"]); //turn .md description into HTML

      listprojects[project] = projectData; //building a list to be used in the partial for the index page

      //copying the files needed in the build folder
      fse.copySync("projects/" + project + "/screen.png", "build/projects/" + project + "/screen.png");
      fse.copySync("projects/" + project + "/bundle.json", "build/projects/" + project + "/bundle.json");
      //fse.copySync("projects/"+project+"/network.gexf", "build/projects/"+project+"/network.gexf");
      fse.outputFileSync("build/" + project + ".html", projectTemplate(projectData));
    })


    //building index page
    const index_template = Handlebars.compile(fse.readFileSync("templates/index.hbs", "utf8"));
    fse.outputFileSync("build/index.html", index_template(listprojects));


    // building about page
    const aboutTemplate = Handlebars.compile(fse.readFileSync("templates/about.hbs", "utf8"));
    fse.outputFileSync("build/about.html", aboutTemplate());

  }

}

forge.build(function(err) { // execute the build
  if (err) {
    throw err;
  }
});
