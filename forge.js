const marked = require("marked");
const fse = require("fs-extra");
const Handlebars = require("handlebars")
const yamlFront = require("yaml-front-matter");


module.exports = {
  build: function() {

    //const reg = /\.[^.]+$/;
    listprojects = {};

    //building leftBar
    Handlebars.registerPartial("leftBarPartial", fse.readFileSync("./partials/left_bar.hbs", "utf8"));

    fse.removeSync("./build");

    //getting the assets
    fse.copy("./assets", "./build/assets")

    // building project page
    var project_template = Handlebars.compile(fse.readFileSync("./templates/project.hbs", "utf8"));


    fse.readdirSync("./projects").forEach(project => {
      //var projectname = project.split(reg)[0];
      var project_data = yamlFront.loadFront(fse.readFileSync("./projects/" + project + "/" + project + ".md", "utf8"));
      console.log(project)

      project_data["__content"] = marked(project_data["__content"]);

      listprojects[project] = project_data; //building a list to be used in the partial for the index page

      fse.outputFileSync("./build/projects/" + project_data.slug + ".html", project_template(project_data));
    })


    //building index page

    Handlebars.registerPartial("projectSmallPartial", fse.readFileSync("./partials/project_small.hbs", "utf8"));

    var index_template = Handlebars.compile(fse.readFileSync("./templates/index.hbs", "utf8"));

    var index_data = listprojects;


    fse.outputFileSync("./build/index.html", index_template(index_data));



  }

}
