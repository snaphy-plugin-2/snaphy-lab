const {join} =  require("path");

module.exports = (server) => {
  const NAME = "snaphyLab";
  const DESCRIPTION = "Snaphy test lab for plugin and Web API";
  const ANGULAR_MODULE = "snaphyLab";
  const VERSION =  "2.0.0";
  const AUTHOR =  "Robins Gupta";
  const PLUGIN_PATH =  join(__dirname, "../../common/plugins");
  const SERVER_PATH =  join(__dirname, "../../server/server.js");
  const SERVER_FOLDER =  join(__dirname, "../../server");
  const MODEL_PATH = join(__dirname, "../../common/models");
  const VALIDATION_PATH = join(__dirname, "../../common/validations");
  const TABLE_PATH = join(__dirname, "../../common/table");
  const SETTING_PATH = join(__dirname, "../../common/settings");

  //Write all the plugins name whose load priority is to be set...
  const PLUGIN_PRIORITY = ["dashboard"];

  return {
    NAME,
    PLUGIN_PATH,
    DESCRIPTION,
    ANGULAR_MODULE,
    SERVER_PATH,
    SERVER_FOLDER,
    MODEL_PATH,
    VALIDATION_PATH,
    TABLE_PATH,
    SETTING_PATH,
    PLUGIN_PRIORITY,
    VERSION,
    AUTHOR
  }
};
