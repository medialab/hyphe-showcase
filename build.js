const marked = require("marked");
const fse = require("fs-extra");
const Handlebars = require("handlebars");
const yamlFront = require("yaml-front-matter");


const forge = {
  build: function() {

    //const reg = /\.[^.]+$/;
    const listprojects = {};

    fse.removeSync("./build");

    //getting the assets
    fse.copySync("./assets", "./build/assets");

    // building project page
    const projectTemplate = Handlebars.compile(fse.readFileSync("./templates/project.hbs", "utf8"));


    fse.readdirSync("./projects").forEach(project => {
      //var projectname = project.split(reg)[0];
      const projectData = yamlFront.loadFront(fse.readFileSync("./projects/" + project + "/description.md", "utf8"));

      projectData.slug = project;

      projectData.__content = marked(projectData["__content"]); //turn .md description into HTML

      listprojects[project] = projectData; //building a list to be used in the partial for the index page


      fse.outputFileSync("./build/projects/" + project + ".html", projectTemplate(projectData));
    })


    //building index page

    Handlebars.registerPartial("projectSmallPartial", fse.readFileSync("./partials/project_small.hbs", "utf8"));

    const index_template = Handlebars.compile(fse.readFileSync("./templates/index.hbs", "utf8"));

    fse.outputFileSync("./build/index.html", index_template(listprojects));

    fse.copySync("./templates/about.html", "./build/about.html");


  }

}

forge.build(function (err) {  // execute the build
  if (err) {
      throw err;
  }
});
